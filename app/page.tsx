"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/public/assets/Logo.svg"
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useEnsName } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={Logo}
            alt="ProofVault Logo"
            width={100}
            height={40}
            className="cursor-pointer"
          />
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="lg:hidden text-white text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Nav links desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link href="/" className="hover:text-gray-400 text-sm">Home</Link>
          <Link href="/about" className="hover:text-gray-400 text-sm">About Us</Link>
          <Link href="/files" className="hover:text-gray-400 text-sm">Files</Link>
        </div>

        {/* Wallet Connect */}
        <div className="hidden lg:block">
          {mounted && <ConnectButton />}
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
  <div className="absolute right-0 top-16 bg-black w-60 py-4 px-6 flex flex-col items-end space-y-4 shadow-lg rounded-bl-xl z-50 lg:hidden">
    <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-gray-400">Home</Link>
    <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-gray-400">About Us</Link>
    <Link href="/files" onClick={() => setMenuOpen(false)} className="hover:text-gray-400">Files</Link>
    {mounted && <ConnectButton />}
  </div>
)}

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

        {/* Welcome message */}
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

      {/* Background SVG */}
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
