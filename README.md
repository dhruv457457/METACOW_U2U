![MetaCow Logo](https://res.cloudinary.com/dg2q2tzbv/image/upload/v1752641861/hackzen/j4p52rud65lqtgrfwyng.png)
# 🐮 MetaCowDEX — Social DeFi Trading with Identity & Rewards

MetaCowDEX is a decentralized exchange that blends token swaps, liquidity provisioning, and social trading into a unified on-chain identity experience. Built for the modern DeFi user, MetaCowDEX lets you trade, earn, follow, and build your reputation—all in one place.

> 🔴 **Live Demo:** [https://metacowdex.vercel.app](https://metacowdex.vercel.app)  
> 🟢 **Backend API:** Deployed on Render  
> ⛓️ **Chain:** BNB Chain Testnet

> 🧑‍💻 **Deployer:** `0xF8A440f0c3912F42dF794983B8164cB6572fCBCC`  
> 🏗 **Pair Logic:** `0xad546B8Af6dDDc3113705aa3Eb659D67141A264F`  
> 🏭 **Factory Proxy:** `0x524Fec22546B087E91D198745CdD6ea94C057D79`

---

## 🚀 What We Built

MetaCowDEX is more than a DEX — it's a **social finance platform** powered by on-chain activity. It transforms your wallet into your identity:

- 🔁 **Swap tokens**, including any ERC-20 tokens
- 💧 **Provide liquidity** and **earn rewards**
- 🧠 **Follow** and **copy** high-performing traders
- 📊 **Build reputation** based on your DeFi activity
- 🪙 **Claim test tokens** via MetaCowDEX faucet

---

## 🔐 Integration Highlights

- ✅ **MetaMask SDK**: Enables secure, direct wallet connection and transaction signing with minimal friction
- ✅ **ERC-20 Support**: Trade and provide liquidity for any ERC-20 token
- ✅ **Upgradeable contracts**: Built with OpenZeppelin's transparent proxy standard

---

## 🎯 Real-World Relevance

MetaCowDEX maps directly to the vision of social DeFi:

| Use Case | Implementation |
|----------|----------------|
| **Wallet-linked identity** | Profiles with history, avatar, wallet-based scores |
| **ERC-20 token usage**     | Full support for any ERC-20 token on BNB Chain |
| **DeFi-based rewards**     | LP tokens generate reward flows and build reputation |
| **Copy-trading triggers**  | 1-click replicate trades from top wallets |
| **Social exploration**     | Follow wallets, view public profiles, compare stats |

---

## 🧩 Core Features

| Feature               | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| 🔁 Token Swapping      | Trade any listed ERC-20 pair (e.g., BNB ⇄ ERC-20)                            |
| 💧 Liquidity Provision | Add/remove LP and earn rewards                                              |
| 👤 Social Trading      | Follow wallets, view trades, copy recent actions                            |
| 🧠 Reputation Score     | Wallet score based on swap volume, LP, and engagement                      |
| 🪙 Faucet Integration   | Built-in token faucet for test tokens                                      |
| 🛠 MetaMask SDK        | Seamless wallet login + transaction flow                                   |
| 🏗 Upgradeable Logic    | Transparent proxy pattern using Hardhat + OpenZeppelin                     |

---

## 🏗️ Architecture Overview

![MetaCowDEX Architecture](https://res.cloudinary.com/dg2q2tzbv/image/upload/v1752678035/Untitled_diagram___Mermaid_Chart-2025-07-16-145917_w0p4et.png)

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, Framer Motion, Ethers.js, MetaMask SDK, Three.js, @react-three/fiber, @react-three/drei
- **Backend:** Node.js, Express, MongoDB, Alchemy SDK
- **Smart Contracts:** Solidity, Hardhat, OpenZeppelin (ERC20, Upgradeable, Proxy)
- **DevOps:** Vercel (frontend), Render (backend), Hardhat (contracts), GitHub Actions (CI/CD)
- **Other:** Cloudinary (image uploads), Draco (3D model compression)

---

## 🌐 Live Demo

- **Frontend:** [https://metacowdex.vercel.app](https://metacowdex.vercel.app)
- **Backend:** Hosted on Render
- **Chain:** BNB Chain Testnet

---

## 🧪 Local Development

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/META_COW.git
cd META_COW
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment Variables

Create `.env` files in both `frontend/` and `backend/` as needed.  
Example for frontend:
```
VITE_FACTORY_ADDRESS=0x524Fec22546B087E91D198745CdD6ea94C057D79
VITE_CHAIN_ID=97
```

### 3. Run Locally

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend
npm run dev
```

**Contracts (optional):**
```bash
cd contracts
npx hardhat deploy --network bnbTestnet
```

---

## 📦 Project Structure

```
META_COW/
  backend/         # Node.js/Express API, MongoDB models, controllers, routes
  contracts/       # Solidity smart contracts, Hardhat config, deployment scripts
  frontend/        # React app, 3D model, components, pages, contexts, hooks
```

---

## 🔐 Security & Best Practices

- **MetaMask SDK:** Secure wallet connection and transaction signing
- **Upgradeable Contracts:** OpenZeppelin proxy pattern for upgradability
- **Draco Compression:** Fast, efficient 3D model loading
- **Error Handling:** User-friendly toasts and error messages throughout

---

## 🧠 Notable Design Choices

- **On-chain social graph:** Follows, posts, and copy trades are all tied to wallet addresses
- **Reputation engine:** Aggregates on-chain and social activity for scoring
- **3D branding:** Unique, interactive MetaCow 3D model on homepage
- **Responsive UI:** Fully mobile-friendly, with custom loader and animated transitions

---

## 🤝 Contributing

Pull requests and issues are welcome!  
Please open an issue for feature requests or bug reports.

---

## 🙋‍♂️ Authors

- Dhruv Pancholi
- Suhani Sharma

---

## 📄 License

MIT

---

## 📣 Acknowledgements

- [MetaMask SDK](https://docs.metamask.io/guide/sdk.html)
- [OpenZeppelin](https://openzeppelin.com/)
- [Three.js](https://threejs.org/)
- [Vercel](https://vercel.com/)
- [Alchemy](https://www.alchemy.com/)





