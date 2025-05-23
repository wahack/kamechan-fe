import { NextRequest, NextResponse } from "next/server";
import cron from 'cron-validate'
import { getWorkflowDetail, getWorkflowNodes } from "@/db/services/workflow";
import { parseJson } from "@/utils/parseJson";
import { Workflow } from "@/workflow/types";
import { isUserConfigNode, isUserWalletSignNode } from "@/workflow/nodeFn";
import { get, map, omit, pick } from "radash";
import { activateJob, createScheduleJob } from "@/workflow/execute";
import { v4 } from "uuid";
import { db } from "@/db";
import { ScheduledExecution, users, workflows } from "@/db/schema";
import {auth} from '@/utils/auth'
import { eq } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
  const {
    workflowId,
    config,
    schedule,
    scheduleText
  } = await req.json();
  const session = await auth();
  if (!session?.user.id) return  NextResponse.json({code: 401, message: 'unAuthorized'});
  const cronResult = cron(schedule);
  if (!cronResult.isValid()) return NextResponse.json({code: 1, message: 'schedule is invalid'});
  const workflowNodes = await getWorkflowNodes(workflowId)
  if (!workflowNodes) return NextResponse.json({code: 404, message: 'workflow not found'});

  const workflowNodesParsed =  parseJson(workflowNodes) as Workflow;

  if (workflowNodesParsed.nodes.find( i => isUserWalletSignNode(i))) return NextResponse.json({code: 2, message: 'This workflow not supported to run on cloud'});
  const configNodes = workflowNodesParsed.nodes.filter( i => isUserConfigNode(i) && !get(config || {}, i.name));
  
  if (configNodes.length) {
    // return config mode
    return NextResponse.json({code: 2, message: "before running on cloud, config first", data: configNodes.map(i => {
      return {
        name: i.name,
        // @ts-ignore
        fields: Object.entries(omit(parseJson(i.parameters.params), ['action'])).map(field => {
          return {
            label: field[0],
            ...(field[1] as object)
          }
        })
      }
    })})
  } else {
    // add schedule
    const id = v4();
    const jobId = await createScheduleJob({
      id,
      cron: schedule,
      config,
      workflowData: workflowNodesParsed
    });
    await activateJob(jobId);
    await db.insert(ScheduledExecution).values({
      id,
      jobId,
      userId: session.user.id,
      workflowId,
      cron: schedule,
      cronText: scheduleText,
      status: 1
    })
    return NextResponse.json({code:0, message: 'ok'})
  }
}

export const GET = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user.id) return  NextResponse.json({code: 401, message: 'unAuthorized'});
  const userId = session.user.id
  const list = await db.select({
    id: ScheduledExecution.id,
    status: ScheduledExecution.status,
    cronText: ScheduledExecution.cronText,
    workflowId: ScheduledExecution.workflowId
  }).from(ScheduledExecution).where(eq(ScheduledExecution.userId, userId));
  const result = await map(list, async item => {
     const [workflow] = await getWorkflowDetail(item.workflowId)
     return {
      ...pick(workflow, ['user', 'title', 'description']),
      ...item
     }
  })
  return NextResponse.json({code: 0, data: result})
}