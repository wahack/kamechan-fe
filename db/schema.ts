import { ExecutionStep } from "@/types/workflow";
import type { Message } from "ai";

import {
  serial,
  pgTable,
  index,
  uuid,
  boolean,
  jsonb,
  primaryKey,
  varchar,
  integer,
  text,
  vector,
  timestamp,
} from "drizzle-orm/pg-core";
// import type { AdapterAccountType } from "next-auth/adapters"

export const knowledgesTable = pgTable(
  "knowledge",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", {
      mode: 'date',
      withTimezone: true
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: 'date',
      withTimezone: true
    }).defaultNow(),
    name: varchar("name", { length: 255 }).notNull(),
    baseUrl: varchar("baseUrl").notNull(),
    url: varchar("url", { length: 255 }),
    title: varchar("title", { length: 255 }),
    description: varchar("description"),
    favicon: varchar("favicon"),
    content: text("content"),
    summary: text("summary"),
    summaryEmbedding: vector("summaryEmbedding", { dimensions: 1536 }),
  },
  (table) => [
    index("summaryEmbeddingIndex").using(
      "hnsw",
      table.summaryEmbedding.op("vector_cosine_ops"),
    ),
  ],
);
export const nodesTable = pgTable('node', {
  id: uuid('id').defaultRandom(),
  name: text('name').unique().primaryKey(),
  description: text('description'),
  logoUrl: text('logo_url'),
  createdAt: timestamp("created_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow()
})

export const apiDocsTable = pgTable(
  "node_doc",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", {
      mode: 'date',
      withTimezone: true
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: 'date',
      withTimezone: true
    }).defaultNow(),
    name: text("name")
    .notNull()
    .references(() => nodesTable.name),
    // action: varchar("action", { length: 255 }),
    // url: varchar("url"),
    content: text("content"),
    description: text("description"),
    descriptionEmbedding: vector("descriptionEmbedding", { dimensions: 1536 }),
  },
  (table) => [
    index("descriptionEmbeddingIndex").using(
      "hnsw",
      table.descriptionEmbedding.op("vector_cosine_ops"),
    ),
  ],
);

export const users = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  address: varchar("address").notNull(),
  pubKey: text("pub_key").notNull().unique(),
  name: text("name").notNull().unique(),
  updatedAt: timestamp("updated_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  createdAt: timestamp("created_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),

  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", {
    mode: 'date',
    withTimezone: true
  }),
  image: text("image"),
});

export const chatsTable = pgTable("chat", {
  id: varchar("id", { length: 16 }).primaryKey(),
  createdAt: timestamp("created_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  messages: jsonb("messages").notNull().$type<Message[]>(),
  tagline: text("tagline"),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

/**
 * next-auth schema below
 */
export const accounts = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: 'date',
    withTimezone: true
  }).notNull(),
});

export const authenticators = pgTable("authenticator", {
  credentialId: varchar("credential_id").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("provider_account_id").notNull(),
  credentialPublicKey: text("credential_public_key").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credential_device_type").notNull(),
  credentialBackedUp: boolean("credential_backed_up").notNull(),
  transports: text("transports"),
  createdAt: timestamp("created_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
});

export const workflows = pgTable("workflow", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  flowchart: text("flowchart"),
  workflowNodes: text("workflow_nodes").notNull(),
  createdAt: timestamp("created_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  nodes: text("nodes").array().default([]).$type<string[]>(),

  cron: varchar("cron", { length: 255 }),
  isPublic: boolean("is_public").default(false).$type<boolean>(),
  activated: boolean("activated").$type<boolean | null>()
}, (table) => ({
  // 添加 GIN 索引加速数组操作
  nodesIndex: index("nodes_idx").using("gin", table.nodes),
}));

export const messageWorkflow = pgTable("message_workflow", {
  id: uuid("id").primaryKey(), // also messageid
  // userId: uuid("user_id")
  //   .notNull()
  //   .references(() => users.id, { onDelete: "cascade" }),
  // chatId: uuid('chat_id').notNull().references(() => chatsTable.id, { onDelete: 'cascade' }),
  workflowNodes: text("workflow_nodes").notNull(),
  flowchart: text("flowchart"),
  reasoning: text('reasoning'),
  executionData: text("execution_data").default("{}"),
  steps: jsonb("steps").default([]).$type<ExecutionStep[]>(),
  createdAt: timestamp("created_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  status: integer("status").default(0), // 0 未启动，1处理中，2 暂停 3完成 4失败
});


export const executionsTable = pgTable('execution', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sourceType: integer("source_type"), // 1 message 2 workflow
  sourceId: text('source_id'),
  workflowNodes: text('workflow_nodes').notNull(),
  executionData: text("execution_data").default("{}"),
  steps: jsonb("steps").notNull().default([]).$type<ExecutionStep[]>(),
  createdAt: timestamp("created_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  status: integer("status").default(0).notNull()
})

export const ScheduledExecution = pgTable('execution_scheduled', {
  id: uuid('id').primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  workflowId: uuid("workflow_id")
    .notNull()
    .references(() => workflows.id, { onDelete: "cascade" }),
  jobId: text('job_id').notNull(),
  cron: text('cron'),
  cronText: text('cron_text'),
  status: integer('status').default(0),
  executedCount: integer('executed_count').default(0),
  successCount: integer('success_count').default(0),
  errorCount: integer('error_count').default(0),
  createdAt: timestamp("created_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: 'date',
    withTimezone: true
  }).defaultNow()
})