import { getMessageWorkflow } from "@/db/services/messageWorkflow";
import { createWorkflow } from "@/db/services/workflow";
import { NextRequest, NextResponse} from "next/server";
import { auth } from "@/utils/auth";

export const GET = async (req: NextRequest) => {
  const messageId = req.nextUrl.searchParams.get("messageId");
  if (!messageId) return NextResponse.json({code: 404, message: "Not Found"});
  const  [result] = await getMessageWorkflow(messageId)
  if (!result ||  !result.reasoning) return NextResponse.json({code: 404, message: "Not Found"});
  const index = result.reasoning.indexOf('\n');
  const {title, content} =  {
    title: (index === -1 ? result.reasoning.slice(0, 20) : result.reasoning.slice(0, index)).replaceAll('#',''),
    content: index === -1? result.reasoning : result.reasoning.slice(index + 1)
  } 
  return NextResponse.json({
    code: 0,
    data: {
      title,
      content
    }
  })
}

export const POST = async (req: NextRequest) => {
  const {
    messageId, title, content
  } = await req.json();
  const session = await auth();

  if (!messageId) return NextResponse.json({code: 404, message: "Not Found"});
  const  [result] = await getMessageWorkflow(messageId)
  if (!result) return NextResponse.json({code: 404, message: "Not Found"});

  const createdResult  = await createWorkflow({
    userId: session?.user.id,
    title,
    description: content,
    flowchart: result.flowchart,
    workflowNodes: result.workflowNodes
  })

  return NextResponse.json({
    code: 0,
    data: createdResult,
    message: 'ok'
  })

}