import { db } from "..";
import { messageWorkflow } from "../schema";
import { jsonrepair } from "jsonrepair";

import { eq, sql, and } from "drizzle-orm";
import { ExecutionStep } from "@/types/workflow";
// import { json } from "drizzle-orm";

export async function createMessageWorkflow(id: string, workflowNodes: string, reasoning: string, chart: string) {
  const repairedJson = jsonrepair(workflowNodes);
  try {
    JSON.parse(repairedJson);
  } catch (e) {
    throw new Error("createMessageWorkflow error: workflowNodes invalid");
  }
  return await db.insert(messageWorkflow).values({
    workflowNodes: repairedJson,
    reasoning,
    id,
    flowchart: chart
  });
}

export async function getMessageWorkflow(id: string) {
  return await db
    .select()
    .from(messageWorkflow)
    .where(eq(messageWorkflow.id, id))
    .limit(1);
}

export async function addExecutionStep(id: string, step: ExecutionStep) {
  return await db
    .update(messageWorkflow)
    .set({
      steps: sql`${messageWorkflow.steps} || ${sql.param(JSON.stringify([step]))}::jsonb`
    })
    .where(eq(messageWorkflow.id, id));
}

export async function setExecutionData(id: string, executionData: string) {
  return await db
    .update(messageWorkflow)
    .set({
      executionData,
    })
    .where(eq(messageWorkflow.id, id));
}

export async function setExecutionSteps(id: string, steps: ExecutionStep[]) {
  return await db
    .update(messageWorkflow)
    .set({
      steps,
    })
    .where(eq(messageWorkflow.id, id));
}

export async function setMessageWorkflowStatus(id: string, status: number) {
  return await db
    .update(messageWorkflow)
    .set({
      status,
    })
    .where(eq(messageWorkflow.id, id));
}

export async function updateMessageWorkflow(id: string, data:  Partial<typeof messageWorkflow.$inferInsert>) {
  return await db
    .update(messageWorkflow)
    .set(data)
    .where(eq(messageWorkflow.id, id));
}