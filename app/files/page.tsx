"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { registerProof, ownerOfHash, getProofs } from "@/lib/proofVault";

export default function FilesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [searchHash, setSearchHash] = useState("");
  const [searchResult, setSearchResult] = useState<{
    owner: string;
    timestamp: number;
  } | null>(null);

  const [history, setHistory] = useState<
    { fileHash: string; timestamp: number }[]
  >([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleNewFile = () => {
    setSelectedFile(null);
    setFileHash(null);
    setSearchResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generateHash = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setFileHash(hexHash);
  };

  const switchToBaseSepolia = async () => {
    const baseSepolia = {
      chainId: "0x14A34",
      chainName: "Base Sepolia",
      rpcUrls: ["https://sepolia.base.org"],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://sepolia.basescan.org"],
    };

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: baseSepolia.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [baseSepolia],
        });
      }
    }
  };

  const refreshHistory = async () => {
    if (!address) return;
    try {
      const result = await getProofs(address);
      setHistory(result);
    } catch (err) {
      console.error("Error loading history", err);
    }
  };

  const handleRegister = async () => {
    if (!fileHash) return;
    try {
      const hashHex = fileHash.startsWith("0x") ? fileHash : "0x" + fileHash;
      const tx = await registerProof(hashHex);
      toast.success("✅ File successfully registered");
      await refreshHistory();
    } catch (err: any) {
      const message =
        err?.message?.includes("already registered") ||
        err?.data?.message?.includes("revert")
          ? "⚠️ This file is already registered."
          : "❌ Error registering file";
      toast.error(message);
      console.error(err);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast("🔗 Hash copied to clipboard", { duration: 2000 });
    } catch (err) {
      toast.error("❌ Failed to copy hash");
    }
  };

  const handleSearch = async () => {
    try {
      const hash = searchHash.startsWith("0x") ? searchHash : "0x" + searchHash;
      const owner = await ownerOfHash(hash);
      if (owner === "0x0000000000000000000000000000000000000000") {
        setSearchResult(null);
        alert("Hash not found");
        return;
      }

      const proofs = await getProofs(owner);
      const proof = proofs.find(
        (p: any) => p.fileHash.toLowerCase() === hash.toLowerCase(),
      );
      if (proof) {
        setSearchResult({
          owner,
          timestamp: Number(proof.timestamp),
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying hash");
    }
  };

  useEffect(() => {
    refreshHistory();
  }, [address]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Navbar */}
<nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full relative">
  {/* Logo */}
  <Link href="/" className="flex items-center">
    <Image
      src="/assets/Logo.svg"
      alt="ProofVault Logo"
      width={100}
      height={40}
      className="cursor-pointer"
    />
  </Link>

  {/* Hamburger for mobile */}
  <button
    className="lg:hidden text-white text-xl"
    onClick={() => setMenuOpen((prev) => !prev)}
  >
    ☰
  </button>

  {/* Desktop links */}
  <div className="hidden lg:flex items-center space-x-6">
    <Link href="/" className="hover:text-gray-400 text-sm">Home</Link>
    <Link href="/about" className="hover:text-gray-400 text-sm">About Us</Link>
    <Link href="/files" className="hover:text-gray-400 text-sm">Files</Link>
    {mounted && <ConnectButton />}
  </div>

  {/* Mobile dropdown aligned right */}
  {menuOpen && (
    <div className="absolute right-0 top-16 bg-black w-60 py-4 px-6 flex flex-col items-end space-y-4 shadow-lg rounded-bl-xl z-50 lg:hidden">
      <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-gray-400">Home</Link>
      <Link href="/about" onClick={() => setMenuOpen(false)} className="hover:text-gray-400">About Us</Link>
      <Link href="/files" onClick={() => setMenuOpen(false)} className="hover:text-gray-400">Files</Link>
      {mounted && <ConnectButton />}
    </div>
  )}
</nav>


      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* File Upload */}
        <div className="border border-blue-400 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold">Drag your file</h2>
          <p className="text-sm mb-4">or click here</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="mb-4"
          />
          <p className="text-xs text-gray-400 mb-4 sm:mt-4">
            Your file will not be uploaded. Only a hash will be generated.
          </p>
          <div className="flex justify-center gap-4 flex-wrap mt-4">
            {selectedFile && !fileHash && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
                onClick={() => generateHash(selectedFile)}
              >
                Generate Hash
              </button>
            )}
            {fileHash && (
              <>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
                  onClick={() => {
                    switchToBaseSepolia().then(handleRegister);
                  }}
                >
                  Register on chain
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg"
                  onClick={() => copyToClipboard(fileHash)}
                >
                  Copy Hash
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg"
                  onClick={handleNewFile}
                >
                  New File
                </button>
              </>
            )}
          </div>
          {fileHash && (
            <p className="mt-4 text-sm break-all text-green-400">
              SHA-256: {fileHash}
            </p>
          )}
        </div>

        {/* Verification */}
        <div className="bg-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">PUBLIC VERIFICATION</h2>
          <input
            type="text"
            placeholder="Enter file hash"
            className="w-full p-3 rounded-lg text-black mb-4"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
            onClick={handleSearch}
          >
            Search
          </button>
          {searchResult && (
            <div className="mt-6">
              <h3 className="font-bold text-sm">RESULT</h3>
              <p className="text-sm">
                Timestamp:{" "}
                {new Date(searchResult.timestamp * 1000).toLocaleString()}
              </p>
              <p className="text-sm">Basename: {searchResult.owner}</p>
              <p className="text-sm text-green-400">✅ File exists onchain</p>
            </div>
          )}
        </div>
      </main>

      {/* History Table */}
      <section className="max-w-6xl mx-auto px-4 py-1">
        <h2 className="text-center text-xl font-bold mb-4">
          REGISTRATION HISTORY
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse border-t border-white/20">
            <thead>
              <tr className="border-b border-white/20">
                <th className="p-2">Hash</th>
                <th className="p-2">Date</th>
                <th className="p-2">Explorer</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                [...history].reverse().map((item, index) => (
                  <tr key={index} className="border-b border-white/10">
                    <td className="p-2">{item.fileHash.slice(0, 10)}...</td>
                    <td className="p-2">
                      {new Date(item.timestamp * 1000).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <a
                        className="text-blue-400 underline"
                        href={`https://sepolia.basescan.org/address/${address}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </a>
                    </td>
                    <td className="p-2 text-green-400">✅ Registered</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Background */}
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
