import {
  BrowserPasskeyProvider,
  BrowserPasswordProviderOptions,
  findCommonPublicKey,
  PasskeyKeypair,
} from "@mysten/sui/keypairs/passkey";
import { secp256r1 } from "@noble/curves/p256";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
} from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";

const PASSKEY_UNCOMPRESSED_PUBLIC_KEY_SIZE = 65;

const rpName = "KameChan";
const rpID =
  process.env.NODE_ENV === "production" ? "kamechan.xyz" : "localhost";
export const rpOrigin =
  process.env.NODE_ENV === "production"
    ? "https://app.kamechan.xyz"
    : "http://localhost:3000";

const SECP256R1_SPKI_HEADER = new Uint8Array([
  48, 89,
  // SEQUENCE, length 89
  48, 19,
  // SEQUENCE, length 19
  6, 7,
  // OID, length 7
  42, 134, 72, 206, 61, 2, 1,
  // OID: 1.2.840.10045.2.1 (ecPublicKey)
  6, 8,
  // OID, length 8
  42, 134, 72, 206, 61, 3, 1, 7,
  // OID: 1.2.840.10045.3.1.7 (prime256v1/secp256r1)
  3, 66,
  // BIT STRING, length 66
  0,
  // no unused bits
]);
function parseDerSPKI(derBytes: Uint8Array) {
  if (
    derBytes.length !==
    SECP256R1_SPKI_HEADER.length + PASSKEY_UNCOMPRESSED_PUBLIC_KEY_SIZE
  ) {
    throw new Error("Invalid DER length");
  }
  for (let i = 0; i < SECP256R1_SPKI_HEADER.length; i++) {
    if (derBytes[i] !== SECP256R1_SPKI_HEADER[i]) {
      throw new Error("Invalid spki header");
    }
  }
  if (derBytes[SECP256R1_SPKI_HEADER.length] !== 4) {
    throw new Error("Invalid point marker");
  }
  return derBytes.slice(SECP256R1_SPKI_HEADER.length);
}

export async function _generateRegistrationOptions(
  userID: string,
  userName: string,
) {
  return await generateRegistrationOptions({
    rpName,
    rpID,
    userName,
    userID: isoUint8Array.fromUTF8String(userID), // new TextEncoder().encode(userID),
    userDisplayName: userName,
    timeout: 60000,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "none",
    // Prevent users from re-registering existing authenticators
    excludeCredentials: [],
    // See "Guiding use of authenticators via authenticatorSelection" below
    authenticatorSelection: {
      userVerification: "required",
      residentKey: "required",
      requireResidentKey: true,
    },
  });
  // {
  //   attestation: 'none',
  //   excludeCredentials: [],
  //   extensions: {credProps: true},
  //   challenge: new TextEncoder().encode("Create passkey wallet on Sui"),
  //   rp: process.env.NODE_ENV === "production" ? {name: "KameChan", id: "app.kamechan.xyz"} : {name: "KameChan", id: ""},
  //   timeout: 300000,
  //   user :{
  //     displayName: name,
  //     id: userId,
  //     name
  //   },
  //   authenticatorSelection: {
  //     authenticatorAttachment: "platform",
  //     "userVerification": "required",
  //     "residentKey": "required",
  //     "requireResidentKey": true
  //   },
  // } as BrowserPasswordProviderOptions
}

export async function _generateAuthenticationOptions(
  allowCredentials?: {
    id: Base64URLString;
    transports?: any;
  }[],
) {
  return await generateAuthenticationOptions({
    rpID,
    allowCredentials: allowCredentials || [],
    userVerification: "required",
    timeout: 60000,
  });
}

export async function createPasskey(provider: BrowserPasskeyProvider) {
  const credential = await provider.create();
  if (!credential.response.getPublicKey()) {
    throw new Error("Invalid credential create response");
  } else {
    const derSPKI = credential.response.getPublicKey();
    const pubkeyUncompressed = parseDerSPKI(new Uint8Array(derSPKI!));
    const pubkey = secp256r1.ProjectivePoint.fromHex(pubkeyUncompressed);
    const pubkeyCompressed = pubkey.toRawBytes(true);
    return {
      credential,
      keypair: new PasskeyKeypair(pubkeyCompressed, provider),
    };
  }
}

export async function getWalletInfo(publicKey: Uint8Array) {
  const pubkeyUncompressed = parseDerSPKI(publicKey);
  const pubkey = secp256r1.ProjectivePoint.fromHex(pubkeyUncompressed);
  const pubkeyCompressed = pubkey.toRawBytes(true);
  const keypair = new PasskeyKeypair(
    pubkeyCompressed,
    new BrowserPasskeyProvider(rpName, {
      rpName: rpName,
      rpId: rpID,
    } as BrowserPasswordProviderOptions),
  );
  return {
    address: keypair.getPublicKey().toSuiAddress(),
    pubKey: keypair.getPublicKey().toBase64(),
  };
}
