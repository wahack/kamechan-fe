import { eq, inArray, sql } from "drizzle-orm";
import { db } from "..";
import { workflows, users } from "../schema";
import { fetchNodeLogoByNames } from "./nodeDoc";
import { map, omit } from "radash";
import { workflowToChart } from "@/workflow/toChart";

export async function createWorkflow(data:  Partial<typeof workflows.$inferInsert>) {
  // @ts-ignore
  return await db.insert(workflows).values(data)
}

export async function getWorkflowDetail(id: string) {
  const result = await db.select({
    flowchart: workflows.flowchart,
    title: workflows.title,
    description: workflows.description,
    nodes: workflows.nodes,
    id: workflows.id,
    user: {
      name: users.name
    }
  }).from(workflows).leftJoin(users, eq(workflows.userId, users.id))
  .where(eq(workflows.id, id));
  if (!result.length) return [];
  const nodes = await fetchNodeLogoByNames(result[0].nodes?.filter(i => !!i) as string[]);
  return [{
    ...result[0],
    nodes: result[0].nodes?.map(node => {
      const nodeLogo = nodes.find(i => i.nodeName === node);
      return {
        ...nodeLogo,
        logoUrl: nodeLogo?.logoUrl || ''
      }
    }).filter(i => i.nodeName !== "userInteraction")
  }]
}

export async function getWorkflowNodes(id: string) {
  const [record] =  await db.select({
    workflowNodes: workflows.workflowNodes,
    id: workflows.id,
    user: {
      name: users.name
    }
  }).from(workflows).leftJoin(users, eq(workflows.userId, users.id))
  .where(eq(workflows.id, id))
  return record && record.workflowNodes
}

export async function fetchTrending() {
  const list = await db.select({
    title: workflows.title,
    description: workflows.description,
    id: workflows.id,
    nodes: workflows.nodes,
    user: {
      name: users.name
    }
  }).from(workflows).leftJoin(users, eq(workflows.userId, users.id)).where(inArray(workflows.id, [
    '22eb2285-984b-4f8a-ad62-ec4c2ee63664',
    '6b85ac75-5ba3-41e1-b5f7-3d80d9a1ac90',
    'be166250-3923-4b53-bba9-62d51dc296b8',
    '803889ed-ccaa-4137-bd2c-8542add0c08a'
  ]));
  const nodes = await fetchNodeLogoByNames(list.map(item => item.nodes).flat().filter(i => !!i) as string[]);
  return list.map(item => {
    return {
      ...item,
      nodes: item.nodes?.map(node => {
        const nodeLogo = nodes.find(i => i.nodeName === node);
        return {
          ...nodeLogo,
          logoUrl: nodeLogo?.logoUrl || ''
        }
      }).filter(i => i.nodeName !== "userInteraction")
    }
  })
}
export async function fetcPublicWorkflows() {
  const list = await db.select({
    title: workflows.title,
    description: workflows.description,
    id: workflows.id,
    nodes: workflows.nodes,
    user: {
      name: users.name
    }
  }).from(workflows).leftJoin(users, eq(workflows.userId, users.id)).where(eq(workflows.isPublic, true));
  const nodes = await fetchNodeLogoByNames(list.map(item => item.nodes).flat().filter(i => !!i) as string[]);
  return list.map(item => {
    return {
      ...item,
      nodes: item.nodes?.map(node => {
        const nodeLogo = nodes.find(i => i.nodeName === node);
        return {
          ...nodeLogo,
          logoUrl: nodeLogo?.logoUrl || ''
        }
      }).filter(i => i.nodeName !== "userInteraction")
    }
  })
}

export async function fetchUserWorkflows(userId: string) {
  const list = await db.select({
    title: workflows.title,
    description: workflows.description,
    nodes: workflows.nodes,
    id: workflows.id,
    user: {
      name: users.name
    }
  }).from(workflows).leftJoin(users, eq(workflows.userId, users.id)).where(eq(workflows.userId, userId));
  const nodes = await fetchNodeLogoByNames(list.map(item => item.nodes).flat().filter(i => !!i) as string[]);
  return list.map(item => {
    return {
      ...item,
      nodes: item.nodes?.map(node => {
        const nodeLogo = nodes.find(i => i.nodeName === node);
        return {
          ...nodeLogo,
          logoUrl: nodeLogo?.logoUrl || ''
        }
      }).filter(i => i.nodeName !== "userInteraction")
    }
  })
}

// export async function fetchWorkflowDescShots() {
//   return (await db.select({
//     title: workflows.title,
//     description: workflows.description,
//   }).from(workflows).limit(6).where(eq(workflows.isPublic, true))).map(item => {
//     return `${item.title}<br>${item.description}`
//   })
// }

export async function searchRelevantWorkflowByNodes(nodes: string[], limit: number = 2) {
  return db
    .select({
      workflow: workflows.workflowNodes,
      flowchart: workflows.flowchart,
      similarity: sql<number>`
      (
        SELECT COUNT(*)::float 
        FROM (
          SELECT unnest(${workflows.nodes}) 
          INTERSECT 
          SELECT unnest(ARRAY[${sql.join(nodes.map(n => sql`${n}`), sql`, `)}]::text[])
        ) AS intersection
      ) 
      / 
      NULLIF(
        (
          SELECT COUNT(*)::float 
          FROM (
            SELECT unnest(${workflows.nodes}) 
            UNION 
            SELECT unnest(ARRAY[${sql.join(nodes.map(n => sql`${n}`), sql`, `)}]::text[]) 
          ) AS union_
        ), 
        0
      )
    `.as("similarity"),
    })
    .from(workflows)
    .orderBy(sql`similarity DESC`) 
    .limit(limit)
}

// export async function test() {
//   const list = await db.select({
//     nodes: workflows.workflowNodes,
//     charts: workflows.flowchart,
//     id: workflows.id
//   }).from(workflows).where(eq(workflows.isPublic, true));
  
//   await map(list, async item => {
//     // await db.update(workflows).set({

//     // })
//     const workflow = JSON.parse(item.nodes)
//     workflow.nodes = workflow.nodes.map(node => omit(node, ['notes']))
//     const chart = await workflowToChart(workflow)

//     await db.update(workflows).set({
//       workflowNodes: JSON.stringify(workflow),
//       flowchart: chart
//     }).where(eq(workflows.id, item.id))
//   })
  
// }

// test()