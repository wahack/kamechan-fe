// @ts-nocheck
import { cosineDistance, asc, lt, sql, and, eq } from "drizzle-orm";
import { knowledgesTable } from "./schema";
import { db } from ".";
import { embed } from "ai";
import { openai } from "@/utils/openai";

export const findRelevantKnowledge = async (
  query: string,
  isNode?: boolean,
) => {
  const { embedding: summaryEmbedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });
  const similarity = sql<number>`${cosineDistance(knowledgesTable.summaryEmbedding, summaryEmbedding)}`;
  // similarity smaller the better
  return await db
    .select({
      id: knowledgesTable.id,
      name: knowledgesTable.title,
      url: knowledgesTable.url,
      summary: knowledgesTable.summary,
      content: knowledgesTable.content,
      similarity,
    })
    .from(knowledgesTable)
    .where(
      isNode
        ? and(eq(knowledgesTable.name, "NODE"), lt(similarity, 0.6))
        : lt(similarity, 0.6),
    )
    .orderBy((t) => asc(t.similarity))
    .limit(15);
};

// (async () => {

//   console.log(await findRelevantKnowledge('btc price, cryptocurrency price API, ticker price, bitcoin API', true))
// })()
