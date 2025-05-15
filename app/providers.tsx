'use client';

import { ReactNode, useState } from "react";
import { createConfig, http, WagmiConfig } from "wagmi";
import { base } from "wagmi/chains";
import {
  RainbowKitProvider,
  getDefaultWallets
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

// Asegúrate de tener este valor en tu .env.local
const { connectors } = getDefaultWallets({
  appName: "ProofVault",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // ← ¡clave real aquí!
});

const config = createConfig({
  chains: [base],
  connectors,
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <RainbowKitProvider>
          <MiniKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
            config={{
              appearance: {
                mode: "auto",
                theme: "mini-app-theme",
                name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
                logo: process.env.NEXT_PUBLIC_ICON_URL,
              },
            }}
          >
            {children}
          </MiniKitProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}
