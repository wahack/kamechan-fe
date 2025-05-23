import { NextRequest, NextResponse } from "next/server";
import { fixWorkflow } from "@/ai/workflow/fixWorkflow";
import {
  addExecutionStep,
  getMessageWorkflow,
  setExecutionData,
  setExecutionSteps,
  setMessageWorkflowStatus,
  updateMessageWorkflow,
} from "@/db/services/messageWorkflow";

export const POST = async (req: NextRequest) => {
  const { messageId, errMsg } = await req.json();
  const messageWorkflows = await getMessageWorkflow(messageId);
  if (!messageWorkflows.length)
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  const messageWorkflow = messageWorkflows[0];

  const workflowNodesFixed =  await fixWorkflow(messageWorkflow.workflowNodes, errMsg);
  await updateMessageWorkflow(messageId, {
    steps: [],
    executionData: '{}',
    status: 0,
    workflowNodes: workflowNodesFixed
  })
  return NextResponse.json({code: 0, data: null, message: 'ok'});
}