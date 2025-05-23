import { db } from "@/db";
import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  AuthenticationResponseJSON,
  verifyAuthenticationResponse,
  VerifyAuthenticationResponseOpts,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { redisClient } from "./redis";
import { getWalletInfo, rpOrigin } from "./passkey";
import { authenticators, users } from "@/db/schema";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
import { eq } from "drizzle-orm";
import { JWT } from "next-auth/jwt";
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    address: string;
    pubKey: string;
    name: string;
    id: string;
  }
}
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    /** The user's postal address. */
    address: string;
    pubKey: string;
    name: string;
    /**
     * By default, TypeScript merges new interface properties and overwrites existing ones.
     * In this case, the default session user properties will be overwritten,
     * with the new ones defined above. To keep the default session user properties,
     * you need to add them back into the newly declared interface.
     */
  }
  interface Session {
    user: {
      address: string;
      pubKey: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/get-started",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        registrationData: {},
        authenticationData: {},
        authenticationOption: {},
      },
      authorize: async (credentials) => {
        // console.log('creden......' , credentials);

        if (credentials.registrationData) {
          const _cached = await redisClient.get(
            `generateRegistrationOptions_challenge:${credentials.username}`,
          );
          if (!_cached) throw new Error("challenge expired");
          const { challenge, webAuthnUserID } = JSON.parse(_cached);
          if (!credentials.username || !challenge)
            throw new Error("name is empty");
          const registrationData = JSON.parse(
            credentials.registrationData as string,
          );
          const verification = await verifyRegistrationResponse({
            response: registrationData,
            expectedChallenge: challenge,
            expectedOrigin: rpOrigin,
          });

          if (verification.verified) {
            const { pubKey, address } = await getWalletInfo(
              new Uint8Array(
                isoBase64URL.toBuffer(
                  registrationData.response.publicKey,
                  "base64url",
                ),
              ),
            ); // verification.registrationInfo!.credential.publicKey)
            // if (!verification.registrationInfo) return null;
            return await db.transaction(async (tx) => {
              const [userResult] = await tx
                .insert(users)
                .values({
                  name: credentials.username as string,
                  email: `${credentials.username}@kamechan.xyz`,
                  pubKey,
                  address,
                })
                .returning({ id: users.id });

              await tx.insert(authenticators).values({
                //@ts-ignore
                credentialId: verification.registrationInfo!.credential.id,
                userId: userResult.id,
                providerAccountId: webAuthnUserID,
                credentialPublicKey: isoBase64URL.fromBuffer(
                  verification.registrationInfo?.credential.publicKey!,
                  "base64url",
                ),
                counter: verification.registrationInfo?.credential.counter,
                credentialDeviceType:
                  verification.registrationInfo?.credentialDeviceType,
                credentialBackedUp:
                  verification.registrationInfo?.credentialBackedUp,
                transports: JSON.stringify(
                  verification.registrationInfo?.credential.transports,
                ),
              });
              return {
                id:  userResult.id,
                name: credentials.username as string,
                pubKey,
                address,
              };
            });
          }
          return null;
        } else if (credentials.authenticationData) {
          const authenticationData = JSON.parse(
            credentials.authenticationData as string,
          ) as AuthenticationResponseJSON;
          const authenticationOption = JSON.parse(
            credentials.authenticationOption as string,
          );
          const [authenticator] = await db
            .select()
            .from(authenticators)
            .where(eq(authenticators.credentialId, authenticationData.rawId))
            .limit(1);
          if (!authenticator) return null;
          const { verified } = await verifyAuthenticationResponse({
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
          if (verified) {
            const [user] = await db
              .select()
              .from(users)
              .where(eq(users.id, authenticator.userId));
            if (!user) return null;
            return {
              id: user.id,
              name: user.name,
              pubKey: user.pubKey,
              address: user.address,
            };
          }
        }
        // console.log('no regiset dat');

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return {
        ...token,
        ...user,
      };
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          address: token.address,
          pubKey: token.pubKey,
          name: token.name,
          id: token.id
        },
      };
    },
  },
});
