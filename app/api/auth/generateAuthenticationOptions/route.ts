import { db } from "@/db";
import { authenticators, users } from "@/db/schema";
import { _generateAuthenticationOptions } from "@/utils/passkey";
import { redisClient } from "@/utils/redis";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username } = await req.json();
  let allowCredentials;
  if (username) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.name, username));
    if (!user)
      return NextResponse.json({
        code: 404,
        message: "user not found",
      });
    const list = await db
      .select()
      .from(authenticators)
      .where(eq(authenticators.userId, user.id));
    allowCredentials = list.map((item) => {
      return {
        id: item.credentialId!,
        transports: JSON.parse(item.transports!),
      };
    });
  }
  const options = await _generateAuthenticationOptions(allowCredentials);
  if (username) {
    await redisClient.set(
      `generateAuthentication:${username}`,
      JSON.stringify({
        challenge: options.challenge,
        rpId: options.rpId,
      }),
      "EX",
      60,
    ); // expired 60 sec
  }

  return NextResponse.json({
    code: 0,
    data: options,
  });
}
