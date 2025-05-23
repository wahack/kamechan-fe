import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";
import { fetcPublicWorkflows } from "@/db/services/workflow";

export const GET = async (req: NextRequest) => {
  // const session = await auth();
  // const userId = session?.user.id;
  // if (!userId) return NextResponse.json({ message: "Not Authorize" , code: 401 });
  return NextResponse.json({
    code: 0,
    data: await fetcPublicWorkflows()
  }) 
}