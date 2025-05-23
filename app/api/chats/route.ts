import { NextRequest, NextResponse } from "next/server";
import { findChatsByUser } from "@/db/services/chats";
import { auth } from "@/utils/auth";

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session || !session.user)
      return NextResponse.json({ error: "UnAuthorize" }, { status: 401 });
    const chats = await findChatsByUser(session.user.id!);

    return NextResponse.json(chats);
  } catch (e) {
    console.error("Error in /api/chats:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
