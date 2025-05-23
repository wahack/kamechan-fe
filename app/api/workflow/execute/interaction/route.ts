import { getExecution, updatEexecution } from "@/db/services/execution";
import { NextRequest, NextResponse } from "next/server"
import { get, merge, omit } from "radash";
import { ExecutionStep } from "@/types/workflow";
import { executeWorkflow } from "../_utils";

export const POST = async (req: NextRequest) => {
  const { executionId, userConfig } = await req.json();
  const [execution] =  await getExecution(executionId)
  if (!execution) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  const {executionData, steps} = execution;
  const executionDataNew = Object.assign(JSON.parse(executionData!), userConfig);
  const markdownContent = Object.entries(get(Object.values(userConfig)[0], 'result', {})).map(item => {
    const [key, value] = item;
    const fields = steps.find((i) => !!userConfig[i.action])?.formFields
    if (!fields) return '';
    if (fields.find(f => f.label === key)?.type === 'password') return `${key}: ******`;
    return `${key}: ${value}`;
  }).join('\n\n')
  const updatedSteps =  merge(
    steps,
    [
      {
        ...steps.find((i) => !!userConfig[i.action])!,
        status: "completed",
        requiresInteraction: false,
        markdownContent
      },
    ],
    (step) => !!userConfig[step.action],
  ) as ExecutionStep[];
  await updatEexecution(executionId, {
    steps: updatedSteps, executionData: JSON.stringify(executionDataNew)
  })
  await executeWorkflow(executionId);
  return NextResponse.json({code: 0, message: 'ok'})
}