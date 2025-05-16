import { ethers } from 'ethers';
import { PROOF_VAULT_ADDRESS, PROOF_VAULT_ABI } from '../app/constants/proofVault';


declare global {
  interface Window {
    ethereum?: any;
  }
}

/** 🔗 Conecta al RPC público de Base Sepolia */
const getProvider = () =>
  new ethers.providers.JsonRpcProvider('https://sepolia.base.org');

/** 🔐 Conecta al signer de la wallet del usuario (Coinbase Wallet o MetaMask) */
const getSigner = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
};

/** 📖 Instancia de contrato solo lectura */
const vaultRead = () =>
  new ethers.Contract(PROOF_VAULT_ADDRESS, PROOF_VAULT_ABI, getProvider());

/** ✍️ Instancia de contrato para escritura */
const vaultWrite = () =>
  new ethers.Contract(PROOF_VAULT_ADDRESS, PROOF_VAULT_ABI, getSigner());

/** 🚀 Registra un hash SHA-256 en el contrato */
export async function registerProof(hash: string) {
  const tx = await vaultWrite().registerProof(hash);
  return tx.wait();
}

/** 📄 Devuelve la lista de pruebas para un usuario */
export function getProofs(user: string) {
  return vaultRead().getProofs(user);
}

/** 🔍 Devuelve el dueño (wallet) de un hash */
export function ownerOfHash(hash: string) {
  return vaultRead().getOwnerOfHash(hash);
}
