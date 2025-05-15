"use client";

import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useEnsName } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">

      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full space-y-4 sm:space-y-0">
        <Link href="/">
          <Image src="/assets/Logo.svg" alt="ProofVault Logo" width={100} height={10} className="w-28 sm:w-32 md:w-36 cursor-pointer" />
        </Link>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-8">
          <Link href="/" className="hover:text-gray-400 text-sm sm:text-base">Home</Link>
          <Link href="#" className="hover:text-gray-400 text-sm sm:text-base">About Us</Link>
          <Link href="/files" className="hover:text-gray-400 text-sm sm:text-base">Files</Link>
        </div>
        <div className="self-start sm:self-auto">
          <ConnectButton />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center text-center px-4 sm:px-6 z-10 mt-12 sm:mt-20 md:mt-28">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-400 text-transparent bg-clip-text leading-tight">
          Protect Your Digital Creations.
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-4xl font-semibold mb-6">
          Instantly
        </h2>
        <p className="max-w-md sm:max-w-xl text-white-400 mb-6 text-sm sm:text-base">
          Register proof of authorship, existence, or integrity of any file on the blockchain—without revealing its content or needing lawyers. Generate a verifiable cryptographic receipt in seconds.
        </p>

        {/* Bienvenida con ENS o address */}
        {isConnected && (
          <>
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3">
              Welcome, <span className="font-semibold break-words">{ensName || address}</span>
            </h2>
            <Link
              href="/files"
              className="mt-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm md:text-base transition"
            >
              Go to My Files
            </Link>
          </>
        )}
      </main>

      {/* Fondo SVG */}
      <Image
        src="/assets/LooperBG.svg"
        alt="Fondo Looper"
        width={1400}
        height={200}
        className="absolute bottom-0 w-full pointer-events-none select-none"
      />
    </div>
  );
}
