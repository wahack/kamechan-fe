import { getWorkflowDetail } from "@/db/services/workflow";
import { NextRequest, NextResponse} from "next/server";
import { auth } from "@/utils/auth";

export const GET = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({code: 404, message: "Not Found"});
  const  [result] = await getWorkflowDetail(id)
  if (!result) return NextResponse.json({code: 404, message: "Not Found"});
  return NextResponse.json({
    code: 0,
    data: result
  })
}