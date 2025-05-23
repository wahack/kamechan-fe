import { NextRequest, NextResponse } from "next/server";

import {
  addChat,
  getChat,
  updateChatMessages,
  deleteChat,
} from "@/db/services";

import { generateText } from "ai";
import { Message } from "ai";
import { openrouter } from "@/ai/llmProvider";
import { auth  } from "@/utils/auth";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) => {
  const { chatId } = await params;
  const session = await auth();

  try {
    // Get the authorization header

    if (!session) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(await getChat(chatId, session.user.id!));
  } catch (error) {
    console.error("Error in /api/chats/[chatId]:", error);
    return NextResponse.json(null, { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) => {
  const { chatId } = await params;

  const { messages } = await req.json();
  const session = await auth();

  try {
    if (!session) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const chat = await getChat(chatId, session.user.id!);

    if (!chat) {
      await addChat({
        id: chatId,
        userId: session.user.id!,
        messages,
        tagline: await generateTagline(messages),
      });
      return NextResponse.json({});
    } else {
      return NextResponse.json(
        await updateChatMessages(chatId, session.user.id!, messages),
      );
    }
  } catch (error) {
    console.error("Error in /api/chats/[chatId]:", error);
    return NextResponse.json(false, { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) => {
  const { chatId } = await params;
  const session = await auth();

  try {
    if (!session) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const success = await deleteChat(chatId, session.user.id!);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to delete chat" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error in DELETE /api/chats/[chatId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

const generateTagline = async (messages: Omit<Message, "id">[]) => {
  const { text } = await generateText({
    model: openrouter.chat("openai/gpt-4o-mini"),
    messages: [
      messages[0],
      {
        role: "user",
        content:
          "Generate a 3-5 word description of the chat. Do not include any quotation marks or other punctuation.",
      },
    ],
  });

  return text;
};
