"use client";
import { WalletProvider } from "./wallet";
// import { PostHogProvider } from "./posthog";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUiProviders } from "./hero-ui";

const queryClient = new QueryClient();

interface Props {
  children: React.ReactNode;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    // <PostHogProvider>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <HeroUiProviders
          themeProps={{ attribute: "class", defaultTheme: "light" }}
        >
          {/* <Analytics /> */}
          <SessionProvider>{children}</SessionProvider>
        </HeroUiProviders>
      </WalletProvider>
    </QueryClientProvider>
  );
};

export default Providers;
