import { cosineDistance, asc, lt, sql, and, eq, inArray, desc } from "drizzle-orm";
import { embed } from "ai";
import { openai } from "@/utils/openai";
import { nodeDoc } from "@/drizzle/schema";
import { db } from "..";
import { nodesTable } from "../schema";
export const searchDocByKeyword = async (query: string, limit: number) => {
  
  const { embedding: descriptionEmbedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });
  
  const similarity = sql<number>`${cosineDistance(nodeDoc.descriptionEmbedding, descriptionEmbedding)}`;
  // similarity smaller the better
  return await db
    .select({
      id: nodeDoc.id,
      name: nodeDoc.name,
      content: nodeDoc.content,
      similarity,
      icon: nodesTable.logoUrl
    })
    .from(nodeDoc)
    .where(lt(similarity, 0.8))
    .leftJoin(nodesTable, eq(nodeDoc.name, nodesTable.name))
    .orderBy((t) => asc(t.similarity))
    .limit(limit);
};

export async function fetchHotNode(ids: string[]) {
  return await db
      .select({
        id: nodeDoc.id,
        name: nodeDoc.name,
        content: nodeDoc.content,
        icon: nodesTable.logoUrl,
        createdAt: nodeDoc.createdAt
      })
      .from(nodeDoc)
      .where(inArray(nodeDoc.id, ids))
      .leftJoin(nodesTable, eq(nodeDoc.name, nodesTable.name))
      .orderBy(t => desc(t.createdAt))
}


export async function fetchNodeLogoByNames(names: string[]) {
  return (await db
    .select({
      nodeName: nodesTable.name,
      logoUrl: nodesTable.logoUrl
    })
    .from(nodesTable)
    .where(inArray(nodesTable.name, names)))
}