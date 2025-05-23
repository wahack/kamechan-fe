"use client";

import React, { useEffect } from "react";

import { useLogin } from "@/hooks/useLogin";

// import { useRouter } from 'next/navigation';

import { Button } from "@heroui/react";
import {
  ConnectButton,
  useCurrentAccount,
  useAutoConnectWallet,
} from "@mysten/dapp-kit";
import { useSession } from "next-auth/react";

const LoginButton: React.FC = () => {
  // const router = useRouter();
  const { data: session, status } = useSession();
  const { walletAccount, handleLogin } = useLogin();
  const account = useCurrentAccount();
  const autoConnectionStatus = useAutoConnectWallet();

  console.log(account, walletAccount, autoConnectionStatus);

  return (
    <>
      {!walletAccount?.address ? (
        <ConnectButton />
      ) : status !== "authenticated" ? (
        <Button className="w-24 h-10" onPress={handleLogin}>
          {" "}
          Login{" "}
        </Button>
      ) : (
        <ConnectButton />
      )}
    </>
  );
};

export default LoginButton;
