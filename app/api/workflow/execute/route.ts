import {
  getMessageWorkflow
} from "@/db/services/messageWorkflow";
import { NextRequest, NextResponse } from "next/server";
import { generateId } from "ai";
import { ExecutionStep } from "@/types/workflow";
import { auth } from "@/utils/auth";
import { getWorkflowNodes } from "@/db/services/workflow";
import { createExecution, getExecution } from "@/db/services/execution";
import { executeWorkflow } from "./_utils";

export const POST = async (req: NextRequest) => {
  const { messageId, workflowId } = await req.json();
  const session = await auth();
  const userId = session?.user.id;
  let sourceType, workflowNodes, sourceId
  if (!userId) return NextResponse.json({ error: "Not Authorize" }, { status: 401 });
  // todo: auth user
  if (messageId) {
    const [messageWorkflow] = await getMessageWorkflow(messageId);
    if (!messageWorkflow)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    workflowNodes = messageWorkflow.workflowNodes;
    sourceType = 1;
    sourceId = messageId;
  } else if (workflowId) {
    workflowNodes = await getWorkflowNodes(workflowId)
    if (!workflowNodes)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    sourceType = 2;
    sourceId = workflowId;
  } else {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const {id} = await createExecution(userId, sourceType, sourceId, workflowNodes);

  await executeWorkflow(id);
  return NextResponse.json({code: 0, message: 'ok',data: id});
};

export const GET = async (req: NextRequest) => {
  const executionId = req.nextUrl.searchParams.get("execution");
  // console.log('get messageid', messageId);

  if (!executionId) {
    return NextResponse.json({ message: "executionId is null" , code: 404 });
  }
  const [execution] = await getExecution(executionId);
  if (!execution)
    return NextResponse.json({ message: "Not Found" , code: 404 });
  // const messageWorkflow = messageWorkflows[0];

  return NextResponse.json({
    code: 0,
    data: {
      status: execution.status,
      steps: [
        {
          id: generateId(),
          action: "Start",
          description: "",
          status: "completed",
          requiresInteraction: false,
        } as ExecutionStep,
      ].concat(execution.steps || []),
    }
  });
};
