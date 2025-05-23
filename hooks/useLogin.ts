import { useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export const useLogin = () => {
  const walletAccount = useCurrentAccount();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();
  const { data: session, update, status } = useSession();
  const [ready] = useState(true);

  const handleLogin = async () => {
    const nonceRes = await fetch("/api/auth/nonce", {
      method: "POST",
      body: JSON.stringify({ address: walletAccount?.address }),
    });
    const { nonce } = await nonceRes.json();
    // 签名
    signPersonalMessage(
      {
        message: new TextEncoder().encode(nonce),
      },
      {
        onSuccess: (result) => {
          signIn("suiWalletAuth", {
            walletAddress: walletAccount?.address,
            signedNonce: result.signature,
            redirect: false,
          }).then((r) => {
            console.log(r);
            update();
          });
        },
      },
    );
  };

  return {
    user: session?.user || {},
    ready,
    login: handleLogin,
    logout: () => {},
    fundWallet: () => {},
    linkWallet: () => {},
    isLogin: status === "authenticated",
    walletAccount,
    handleLogin,
  };
};
