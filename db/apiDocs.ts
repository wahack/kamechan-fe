// @ts-nocheck
import { cosineDistance, asc, lt, sql, and, eq } from "drizzle-orm";
import { apiDocsTable } from "./schema";
import { db } from ".";
import { embed } from "ai";
import { openai } from "@/utils/openai";

export const findRelevantApi = async (query: string, limit: number) => {
  
  const { embedding: descriptionEmbedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });
  
  const similarity = sql<number>`${cosineDistance(apiDocsTable.descriptionEmbedding, descriptionEmbedding)}`;
  // similarity smaller the better
  return await db
    .select({
      // id: apiDocsTable.id,
      name: apiDocsTable.name,
      description: apiDocsTable.description,
      content: apiDocsTable.content,
      similarity,
    })
    .from(apiDocsTable)
    .where(lt(similarity, 0.6))
    .orderBy((t) => asc(t.similarity))
    .limit(limit);
};

export const isNodeExist = async (name: string) => {
  const docs = await db.select().from(apiDocsTable).where(eq(apiDocsTable.name, name))
  if (docs && docs.length) return true;
  return false;
}

// (async () => {

//   console.log(await findRelevantApi('okxApi: get market price'))
// })()
