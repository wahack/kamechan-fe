// import "server-only";

// import { add, del, find, get, update } from "./base";

// import { getChatsContainer } from "../containers";
// import { PatchOperationType } from "@azure/cosmos";
import { db } from "..";
import { chatsTable } from "../schema";

import { Chat } from "../types";

import { Message } from "ai";
import { eq, sql, and } from "drizzle-orm";

// CREATE

/**
 * **DATABASE SERVICE**
 *
 * Adds a new chat to the database.
 *
 * @param {Chat} chat - The chat data to be added.
 * @returns {Promise<Chat | null>} The newly created chat or null if creation failed.
 */
export const addChat = async (chat: Chat): Promise<Chat | null> => {
  return await db.insert(chatsTable).values(chat);
};

// READ

/**
 * **DATABASE SERVICE**
 *
 * Retrieves a chat by its ID and course ID.
 *
 * @param {Chat["id"]} id - The ID of the chat to retrieve.
 * @param {Chat["userId"]} userId - The user ID associated with the chat.
 * @returns {Promise<Chat | null>} The retrieved chat or null if not found.
 */
export const getChat = async (
  id: Chat["id"],
  userId: Chat["userId"],
): Promise<Chat | null> => {
  return await db
    .select()
    .from(chatsTable)
    .where(and(eq(chatsTable.id, id), eq(chatsTable.userId, userId)))
    .limit(1)
    .then((rows) => rows[0]);
};

/**
 * **DATABASE SERVICE**
 *
 * Finds all chats for a user.
 *
 * @param {Chat["userId"]} userId - The user ID to search for.
 * @returns {Promise<Chat[]>} An array of chats matching the criteria.
 */
export const findChatsByUser = async (
  userId: Chat["userId"],
): Promise<Chat[]> => {
  return await db
    .select()
    .from(chatsTable)
    .where(eq(chatsTable.userId, userId));
};

// UPDATE

/**
 * **DATABASE SERVICE**
 *
 * Updates a chat's tagline.
 *
 * @param {Chat["id"]} id - The ID of the chat to update.
 * @param {Chat["userId"]} userId - The user ID associated with the chat.
 * @param {string} tagline - The new tagline for the chat.
 * @returns {Promise<boolean>} True if the update was successful, false otherwise.
 */
export const updateChatTagline = async (
  id: Chat["id"],
  userId: Chat["userId"],
  tagline: string,
): Promise<boolean> => {
  return await db
    .update(chatsTable)
    .set({
      tagline,
    })
    .where(and(eq(chatsTable.id, id), eq(chatsTable.userId, userId)));
};

/**
 * **DATABASE SERVICE**
 *
 * Adds a new message to an existing chat.
 *
 * @param {Chat["id"]} id - The ID of the chat to update.
 * @param {Chat["userId"]} userId - The user ID associated with the chat.
 * @param {ChatMessage} message - The message to be added to the chat.
 * @returns {Promise<boolean>} True if the update was successful, false otherwise.
 */
export const addMessageToChat = async (
  id: Chat["id"],
  userId: Chat["userId"],
  message: Message,
): Promise<boolean> => {
  return await db
    .update(chatsTable)
    .set({
      messages: sql`${chatsTable.messages} || ${sql.raw(`'${JSON.stringify([message])}'`)}::jsonb`,
      updatedAt: new Date(),
    })
    .where(and(eq(chatsTable.id, id), eq(chatsTable.userId, userId)));
};

/**
 * **DATABASE SERVICE**
 *
 * Updates a chat's messages.
 *
 * @param {Chat["id"]} id - The ID of the chat to update.
 * @param {Chat["userId"]} userId - The user ID associated with the chat.
 * @param {Message[]} messages - The new messages.
 * @returns {Promise<boolean>} True if the update was successful, false otherwise.
 */
export const updateChatMessages = async (
  id: Chat["id"],
  userId: Chat["userId"],
  messages: Message[],
): Promise<boolean> => {
  return await db
    .update(chatsTable)
    .set({
      messages,
      updatedAt: new Date(),
    })
    .where(eq(chatsTable.id, id));
};

// DELETE

/**
 * **DATABASE SERVICE**
 *
 * Deletes a chat from the database.
 *
 * @param {Chat["id"]} id - The ID of the chat to delete.
 * @param {Chat["userId"]} userId - The user ID associated with the chat.
 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
 */
export const deleteChat = async (
  id: Chat["id"],
  userId: Chat["userId"],
): Promise<boolean> => {
  return await db
    .delete(chatsTable)
    .where(and(eq(chatsTable.id, id), eq(chatsTable.userId, userId)));
};
