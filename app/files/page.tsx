"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export default function FilesPage() {
  const { address, isConnected } = useAccount();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const generateHash = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setFileHash(hexHash);
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full gap-y-4 sm:gap-y-0">
        <Image
          src="/assets/Logo.svg"
          alt="ProofVault Logo"
          width={100}
          height={60}
          className="w-28 sm:w-32 md:w-36"
        />

        <div className="flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-400 text-sm sm:text-base">
            Home
          </Link>
          <Link href="#" className="hover:text-gray-400 text-sm sm:text-base">
            About Us
          </Link>
          <Link
            href="/files"
            className="hover:text-gray-400 text-sm sm:text-base"
          >
            Files
          </Link>
        </div>

        <div className="flex justify-end w-full sm:w-auto">
          <ConnectButton showBalance={true} accountStatus="avatar" />
        </div>
      </nav>

      {/* Main Content Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* File Upload Card */}
        <div className="border border-blue-400 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold">Drag your file</h2>
          <p className="text-sm mb-4">or click here</p>
          <input type="file" onChange={handleFileChange} className="mb-4" />
          <p className="text-xs text-gray-400 mb-4 sm:mt-4">
            Your file will not be uploaded. Only a hash will be generated.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 sm:mt-10 rounded-lg"
            onClick={() => {
              if (selectedFile) {
                generateHash(selectedFile);
              }
            }}
          >
            Register
          </button>
          {fileHash && (
            <p className="mt-4 text-sm break-all text-green-400">
              SHA-256: {fileHash}
            </p>
          )}
        </div>

        {/* Verification Box */}
        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">PUBLIC VERIFICATION</h2>
          <input
            type="text"
            placeholder="Enter file hash"
            className="w-full p-3 rounded-lg text-black mb-4"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg">
            Search
          </button>

          {/* Result */}
          <div className="mt-6">
            <h3 className="font-bold text-sm">RESULT</h3>
            <p className="text-sm">Timestamp</p>
            <p className="text-sm">Basename</p>
            <p className="text-sm">File status</p>
          </div>
        </div>
      </main>

      {/* History Table */}
      <section className="max-w-6xl mx-auto px-4 py-1">
        <h2 className="text-center text-xl font-bold mb-4">
          REGISTRATION HISTORY
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse border-t border-white/20 sm:mt-">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-2">Name</th>
                <th className="p-2">Date</th>
                <th className="p-2">Basename</th>
                <th className="p-2">Link</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Records will be dynamically inserted here */}
            </tbody>
          </table>
        </div>
      </section>

      {/* Background SVG */}
      <Image
        src="/assets/Group4.svg"
        alt="Looper Background"
        width={1400}
        height={200}
        className="absolute bottom-0 w-full pointer-events-none select-none"
      />
    </div>
  );
}
