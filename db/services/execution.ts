import { db } from "..";
import { executionsTable } from "../schema";
import { eq, sql, and } from "drizzle-orm";
import { ExecutionStep } from "@/types/workflow";

export async function createExecution(userId: string, sourceType: number, sourceId: string, workflowNodes: string) {
  const [result] = await db.insert(executionsTable).values({
    userId, sourceType, sourceId, workflowNodes
  }).returning({ id: executionsTable.id });
  return result;
}

export async function getExecution(id: string) {
  return await db
    .select({
      executionData: executionsTable.executionData,
      steps: executionsTable.steps,
      status: executionsTable.status
    })
    .from(executionsTable)
    .where(eq(executionsTable.id, id))
    .limit(1);
}

export async function getExecutionRaw(id: string) {
  return await db
    .select({
      executionData: executionsTable.executionData,
      steps: executionsTable.steps,
      status: executionsTable.status,
      workflowNodes: executionsTable.workflowNodes
    })
    .from(executionsTable)
    .where(eq(executionsTable.id, id))
    .limit(1);
}



export async function addExecutionStep(id: string, step: ExecutionStep) {
  return await db
    .update(executionsTable)
    .set({
      steps: sql`${executionsTable.steps} || ${sql.param(JSON.stringify([step]))}::jsonb`
    })
    .where(eq(executionsTable.id, id));
}

export async function setExecutionData(id: string, executionData: string) {
  return await db
    .update(executionsTable)
    .set({
      executionData,
    })
    .where(eq(executionsTable.id, id));
}

export async function setExecutionSteps(id: string, steps: ExecutionStep[]) {
  return await db
    .update(executionsTable)
    .set({
      steps,
    })
    .where(eq(executionsTable.id, id));
}

export async function setexecutionsStatus(id: string, status: number) {
  return await db
    .update(executionsTable)
    .set({
      status,
    })
    .where(eq(executionsTable.id, id));
}

export async function updatEexecution(id: string, data:  Partial<typeof executionsTable.$inferInsert>) {
  return await db
    .update(executionsTable)
    .set(data)
    .where(eq(executionsTable.id, id));
}