import { db } from "@/db";
import { ScheduledExecution } from "@/db/schema";
import { activateJob, pauseJob } from "@/workflow/execute";
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
    jobId: ScheduledExecution.jobId,
    status: ScheduledExecution.status
  }).from(ScheduledExecution).where(and(eq(ScheduledExecution.id, id),  eq(ScheduledExecution.userId, session.user.id)))
  if (!record) return  NextResponse.json({code: 404, message: 'not found'});
  
  record.status === 1 ? await pauseJob(record.jobId) : await activateJob(record.jobId);

  await db.update(ScheduledExecution).set({
    status: record.status === 1 ? 2: 1
  }).where(and(eq(ScheduledExecution.id, id),  eq(ScheduledExecution.userId, session.user.id)))


  return NextResponse.json({code: 0})
  
}