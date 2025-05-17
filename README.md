# 🔐 Proof Vault

Aplicación descentralizada para registrar y verificar pruebas de existencia de archivos en la red Base.

---

## 🌐 URL del Proyecto

🟢 App desplegada:  
**https://proof-vault-rose.vercel.app**

---

## 🎥 Video de presentación

📺 Mira el video demo (introducción, problema, solución, demo, arquitectura):  
**[YouTube - Demo ProofVault](https://youtu.be/TU_ENLACE_AQUI)**

---

## 🧠 Problema

Actualmente, proteger archivos digitales frente a disputas de autoría o integridad es un proceso lento y centralizado. Las soluciones tradicionales requieren notarización o plataformas con intermediarios.

---

## 🚀 Solución

Proof Vault permite a cualquier persona:

- Generar un hash SHA-256 de su archivo (localmente)
- Registrar ese hash onchain en la red Base
- Verificar públicamente si un archivo fue registrado
- Consultar el historial completo de registros

Privacidad total. Cero backend. Todo en cadena.

---

## 🔨 Funcionalidades

- Registro de archivos vía hash
- Verificación pública por hash
- Historial por wallet
- Conexión con **Smart Wallet / Coinbase Wallet**
- Interfaz simple y responsive

---

## 🧾 Contrato Inteligente

- 📄 `ProofVault.sol`
- ⚙️ Desplegado en **Base Sepolia**
- 📬 Dirección:  
  `0x89393f97fAD88Ac57566A27c00213DE10987c6EE`
- 🔍 [Ver en BaseScan](https://sepolia.basescan.org/address/0x89393f97fAD88Ac57566A27c00213DE10987c6EE)

---

## 🧱 Arquitectura

| Componente       | Tecnología                          |
|------------------|--------------------------------------|
| Frontend         | Next.js (React)                      |
| Web3 Connection  | wagmi + ethers.js                    |
| Wallets          | Coinbase Wallet, Smart Wallet        |
| Blockchain       | Base Sepolia (Optimistic Rollup L2)  |
| Contrato         | Solidity 0.8.28                      |
| Almacenamiento   | Sin archivos – solo hash onchain     |
| Hosting          | Vercel                               |

---

## 📂 Estructura del Proyecto

```txt
/app
  /constants       → ABI y dirección del contrato
  /files           → Página principal de registros
  /lib             → Funciones para conectar con contrato

/contracts
  ProofVault.sol   → Contrato inteligente en Solidity

/public
  logo.svg
  favicon.ico

```

## 🧪 Requisitos

- Tener **Base Sepolia** en tu wallet (`Chain ID: 84532`)
- ETH para gas (en testnet)
- Compatible con **Smart Wallet** y **Coinbase Wallet**

---

## 🏁 Participación en Hackathon

Este proyecto fue desarrollado para el hackathon **Base Batch LatAm 2025**.  
Integra todas las herramientas recomendadas por Base:

- ✅ **Smart Wallet**
- ✅ **Basenames** (opcional)
- ✅ **Contrato desplegado**
- ✅ **App pública y funcional**
