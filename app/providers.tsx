'use client';

import { ReactNode, useState } from "react";
import { createConfig, http, WagmiConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains"; // ✅ Usa la red Testnet correcta
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

// Obtiene los conectores con tu Project ID de WalletConnect
const { connectors } = getDefaultWallets({
  appName: "ProofVault",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
});

// Configura wagmi para Base Sepolia
const config = createConfig({
  chains: [baseSepolia],
  connectors,
  transports: {
    [baseSepolia.id]: http(), // 👈 transporte correcto para testnet
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
            chain={baseSepolia} // ✅ Testnet en MiniKit
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
