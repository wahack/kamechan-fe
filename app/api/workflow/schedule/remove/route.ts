import { db } from "@/db";
import { ScheduledExecution } from "@/db/schema";
import { pauseJob, removeJob } from "@/workflow/execute";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {auth} from '@/utils/auth'

export const POST = async (req: NextRequest) =>{
  const {
    id
  } = await req.json()
  const session = await auth();
  if (!session?.user.id) return  NextResponse.json({code: 401, message: 'unAuthorized'});
  const [record] = await db.select({
    jobId: ScheduledExecution.jobId
  }).from(ScheduledExecution).where(and(eq(ScheduledExecution.id, id),  eq(ScheduledExecution.userId, session.user.id)))
  if (!record) return  NextResponse.json({code: 404, message: 'not found'});
  await removeJob(record.jobId);
  await db.delete(ScheduledExecution).where(and(eq(ScheduledExecution.id, id),  eq(ScheduledExecution.userId, session.user.id)))


  return NextResponse.json({code: 0})
  
}