import {
  AuthenticationResponseJSON,
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { db } from "@/db";
import { authenticators, users } from "@/db/schema";
import { _generateAuthenticationOptions, rpOrigin } from "@/utils/passkey";
import { redisClient } from "@/utils/redis";
import { eq } from "drizzle-orm";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { authenticationData, username } = await req.json();
  const _authenticationOption = await redisClient.get(
    `generateAuthentication:${username}`,
  );
  const [authenticator] = await db
    .select()
    .from(authenticators)
    .where(eq(authenticators.credentialId, authenticationData.rawId))
    .limit(1);
  if (!_authenticationOption || !authenticator)
    return NextResponse.json({
      code: 400,
      message: "passkey auth expired or authenticator not found",
    });

  const authenticationOption = JSON.parse(_authenticationOption);

  const { verified, authenticationInfo } = await verifyAuthenticationResponse({
    response: authenticationData,
    expectedChallenge: authenticationOption.challenge,
    expectedOrigin: rpOrigin,
    expectedRPID: authenticationOption.rpId,
    credential: {
      id: authenticator.credentialId!,
      publicKey: isoBase64URL.toBuffer(
        authenticator.credentialPublicKey,
        "base64url",
      ),
      counter: authenticator.counter,
      transports: JSON.parse(authenticator.transports!),
    },
  });
  if (!verified)
    return NextResponse.json({
      code: 401,
      message: "verified fail",
    });
  return NextResponse.json({
    code: 0,
    data: {
      pubkey: authenticator.credentialPublicKey,
    },
  });
}
