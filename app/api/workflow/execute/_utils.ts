import { eq } from 'drizzle-orm';
import { executeWorkflowIteratively } from "@/workflow/execute";
import { addExecutionStep, getExecutionRaw, setExecutionData, setexecutionsStatus, setExecutionSteps, updatEexecution } from '@/db/services/execution';
import { get, merge, omit } from "radash";
import { getUserInteractionAction, isUserConfigNode, isUserInteractionNode, isUserWalletSignNode } from '@/workflow/nodeFn';
import { ExecutionStep } from "@/types/workflow";
import { generateId } from 'ai';
import { WorkflowNode } from '@/workflow/types';

enum ExecutionStatus {
  Processing = 1,
  Pending = 0,
  Pause = 2,
  Success = 3,
  Failed = 4 
}

export async function executeWorkflow(executionId: string) {
  const [execution] =  await getExecutionRaw(executionId)
  if (![ExecutionStatus.Pending, ExecutionStatus.Pause].includes(execution.status)) return;
  let steps = [...execution.steps]
  let executionData = JSON.parse(execution.executionData!)

  try {
    executeWorkflowIteratively({
      workflowData: JSON.parse(execution.workflowNodes),
      executionData,
      onComplete: async () => {
        await setexecutionsStatus(executionId, ExecutionStatus.Success);
      },
      onError: async (node: WorkflowNode, errMsg: string) => {
        // await setexecutionsStatus(executionId, ExecutionStatus.Failed);
        const updatedSteps = merge(
          steps,
          [
            {
              ...steps.find((i) => i.action === node.name)!,
              status: "error",
              markdownContent: errMsg,
            },
          ],
          (step) => step.action,
        ) as ExecutionStep[];
        // console.log('updated steps', updatedSteps);
        
        await updatEexecution(executionId, {
          steps: [...updatedSteps], status: ExecutionStatus.Failed

      });
      },
      onProcessDone: async (node, nodeOutput, executionData) => {
        // console.log("onProcessDone", node);
        steps = merge(
          steps,
          [
            {
              ...steps.find((i) => i.action === node.name)!,
              status: "completed",
              markdownContent: JSON.stringify(nodeOutput),
            },
          ],
          (step) => step.action,
        ) as ExecutionStep[];
        await updatEexecution(executionId, {
          steps, executionData: JSON.stringify(executionData)
        });
      },
      onProcessStart: async (node) => {
       
        const _isUserConfigNode = isUserConfigNode(node);
        const _isUserWalletSignNode = isUserWalletSignNode(node);
        const _isUserInteraction =  isUserInteractionNode(node)
        await setexecutionsStatus(executionId, _isUserInteraction ? ExecutionStatus.Pause : ExecutionStatus.Processing);
        const step = {
          id: generateId(),
          action: node.name,
          description: node.notes || "",
          status: "processing",
          requiresInteraction: _isUserInteraction,
          origin: _isUserWalletSignNode
            ? JSON.parse(get(node, "parameters.params", "{}"))
            : undefined,
          interactionType: getUserInteractionAction(node),
          formFields: _isUserConfigNode
            ? Object.entries(
                omit(JSON.parse(get(node, "parameters.params", "{}")), [
                  "action",
                ]),
              ).map((keyValue: any) => {
                return {
                  label: keyValue[0],
                  type: keyValue[1].type,
                  options: keyValue[1].options,
                  required: keyValue[1].required,
                };
              })
            : undefined,
        } as ExecutionStep;
        await addExecutionStep(executionId, step);
        steps.push(step);
      },
    });
  } catch (e) {
    await setexecutionsStatus(executionId, ExecutionStatus.Failed);
  }

}