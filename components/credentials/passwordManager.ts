import { requestApi } from "@/app/_utils/request";
import { startAuthentication } from "@simplewebauthn/browser";
import { isoBase64URL } from "@simplewebauthn/server/helpers";
let passkey: any;
export class PasswordManager {
  constructor() {}
  static async authWithPasskey(username: string) {
    const ret1 = await requestApi.post(
      "/api/auth/generateAuthenticationOptions",
      {
        username,
      },
    );
    if (!ret1.data.data) return;
    const authenticationData = await startAuthentication({ optionsJSON: ret1.data.data });
    const ret = await requestApi.post(
      "/api/auth/verifyAuthenticationOptions",
      {
        username,
        authenticationData,
      },
    );
    return isoBase64URL.toBuffer(ret.data.data.pubkey, "base64url");
  }
  static async deriveEncryptionKey(publicKey: Uint8Array): Promise<CryptoKey> {
    const salt = new Uint8Array(0);
    return crypto.subtle.deriveKey(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt,
        info: new TextEncoder().encode("PasskeyEncryptionKey"),
      },
      await crypto.subtle.importKey("raw", publicKey, "HKDF", false, [
        "deriveKey",
      ]),
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    );
  }
  static async encryptData(key: CryptoKey, data: string): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(data),
    );
    const result = JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    });
    localStorage.setItem("encryptedData", result);
    return result;
  }
  static async decryptData(key: CryptoKey): Promise<string> {
    const stored = JSON.parse(localStorage.getItem("encryptedData") || "{}");
    const iv = new Uint8Array(stored.iv);
    const data = new Uint8Array(stored.data);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data,
    );

    return new TextDecoder("utf-8").decode(decrypted);
  }
  static async setCredentials(username: string, data: any) {
    if (!passkey) passkey = await PasswordManager.authWithPasskey(username);
    const cryptoKey = await PasswordManager.deriveEncryptionKey(
      new Uint8Array(passkey!),
    );
    return await PasswordManager.encryptData(cryptoKey, JSON.stringify(data));
  }
  static async getCredentials(username: string) {
    const stored = JSON.parse(localStorage.getItem("encryptedData") || "{}");
    if (!stored.iv || !stored.data) return [];
    if (!passkey) passkey = await PasswordManager.authWithPasskey(username);

    const cryptoKey = await PasswordManager.deriveEncryptionKey(
      new Uint8Array(passkey!),
    );
    return JSON.parse(await PasswordManager.decryptData(cryptoKey));
  }
}
