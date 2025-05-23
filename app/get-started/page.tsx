"use client";
import React, { useState } from "react";
import { Input, Button, Link, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { requestApi } from "../_utils/request";
import { signIn } from "next-auth/react";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function GetStarted() {
  const [username, setUsername] = React.useState("");
  const router = useRouter()
  const { data: session } = useSession()
  if (session?.user.id) {
    router.replace('/workflow/build')
  }
  const [isLoadingSignup, setIsLoadingSignup] = useState(false)
  const [isLoadingLogin, setIsLoadingLogin] = useState(false)

  const handleCreateAccount = async () => {
    if (!username) return;
    setIsLoadingSignup(true);
    try {
      const { data } = await requestApi.post<any>(
        "/api/auth/generateRegistrationOptions",
        {
          username,
        },
      );
      const generateRegistrationOptions = data.data;
      const registrationResponseJSON = await startRegistration({
        optionsJSON: generateRegistrationOptions,
      });
      const result = await signIn("credentials", {
        redirect: false,
        username,
        registrationData: JSON.stringify(registrationResponseJSON),
      });
      if (!result.error) {
        addToast({
          title: "LogIn Success",
          // description: result.error,
          color: "default",
        });
        router.replace("/workflow/build");

      } else {
        addToast({
          title: "LogIn Error",
          description: result.error,
          color: "warning",
        });
      }
    } catch (e) {
      // addToast({
      //   title: "LogIn Error",
      //   description: 'Unexpected Error, try again later',
      //   color: "warning",
      // });
    }
    setIsLoadingSignup(false);   
  };

  const handleLogin = async () => {
    setIsLoadingLogin(true);
    try {
      const { data } = await requestApi.post<any>(
        "/api/auth/generateAuthenticationOptions",
        {
          username,
        },
      );
      const generateAuthenticationOptions = data.data;
      const authenticationResponseJSON = await startAuthentication({
        optionsJSON: generateAuthenticationOptions,
      });
      const result = await signIn("credentials", {
        redirect: false,
        username,
        authenticationData: JSON.stringify(authenticationResponseJSON),
        authenticationOption: JSON.stringify(generateAuthenticationOptions),
      });     
      if (!result.error) {
        addToast({
          title: "LogIn Success",
          // description: result.error,
          color: "default",
        });
        router.replace("/workflow/build");
      } else {
        addToast({
          title: "LogIn Error",
          description: result.error,
          color: "warning",
        });
      }
    } catch (e) {
      // console.log(e);
      
      addToast({
        title: "LogIn Error",
        description: 'Unexpected Error, try again later',
        color: "warning",
      });
    }
    setIsLoadingLogin(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto px-4 py-10">
      {/* Logo - Simplified for minimalist style */}
      <div className="mb-10 flex flex-col items-center">
        <div className="relative w-32 h-16 flex items-center justify-center mb-2">
         
          <Image 
                src="/logo.png" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="w-8 h-8 mr-2 dark:block"
            />
             <div className="text-black-500 font-bold text-2xl tracking-tighter">
            KameChan
          </div>
        </div>
        <h1 className="text-xl font-medium tracking-wide mt-3 text-gray-800">
          WELCOME
        </h1>
      </div>

      {/* Form - Simplified for minimalist style */}
      <div className="w-full space-y-4">
        <Input
          type="text"
          placeholder="Choose a username"
          value={username}
          onValueChange={setUsername}
          autoComplete="webauthn"
          variant="flat"
          classNames={{
            inputWrapper: "bg-white shadow-sm  border border-gray-200 text-black",
            input: "text-black",
          }}
        />

        <Button
          color="primary"
          className="w-full py-5 font-normal "
          disableRipple
          onPress={handleCreateAccount}
          isLoading={isLoadingSignup}
        >
          Create account
        </Button>

        <div className="flex items-center justify-center my-4">
          <span className="text-gray-500 text-xs px-4">OR</span>
        </div>

        <Button
          variant="flat"
          className="w-full py-5 bg-white shadow-sm font-normal   border border-gray-200"
          disableRipple
          isLoading={isLoadingLogin}
          onPress={handleLogin}
        >
          Log in
        </Button>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">
            By continuing, you agree with KameChan{" "}
            <Link href="#" size="sm" className="text-xs text-primary">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="#" size="sm" className="text-xs text-primary">
              Privacy Policy
            </Link>
          </p>

          <p className="text-gray-500 text-xs mt-4">
            Your KameChan Account is secured with a passkey – a safer
            replacement for passwords.{" "}
            <Link href="#" size="sm" className="text-xs text-primary">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
