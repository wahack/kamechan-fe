import crypto from "crypto";
import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { _generateRegistrationOptions } from "@/utils/passkey";
import { redisClient } from "@/utils/redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username } = await req.json();
  const users = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.name, username));

  if (users.length)
    return NextResponse.json({ code: 400, message: "username is not available" });
  const options = await _generateRegistrationOptions(v4(), username);

  await redisClient.set(
    `generateRegistrationOptions_challenge:${username}`,
    JSON.stringify({
      challenge: options.challenge,
      webAuthnUserID: options.user.id,
    }),
    "EX",
    60,
  ); // expired 60 sec

  return NextResponse.json({
    code: 0,
    data: options,
  });
}
