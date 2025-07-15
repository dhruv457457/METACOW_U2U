import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useWallet } from "../contexts/WalletContext";
import metaCowLogo from "../assets/MetaCowLogo.png";
import SearchFollow from "../components/SearchFollow";
import { motion, useScroll, useTransform } from "framer-motion";
import MetaCowModel from "../components/MetaCowModel";

export default function Home() {
  const { walletData } = useWallet();
  const address = walletData?.address;
  const isConnected = !!address;
  const [userId, setUserId] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);

  const setMouseCoordsFromSection = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMouse({ x, y });
  };

const features = [
  {
    title: "On-Chain Token Swaps",
    description: "Swap tokens instantly using upgradeable smart contracts deployed on BNB Chain.",
    icon: "🔁",
    gradient: "from-indigo-400 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
    borderColor: "border-indigo-200",
  },
  {
    title: "Liquidity Provision",
    description: "Add or remove liquidity to any pair seamlessly, with low slippage and instant updates.",
    icon: "💧",
    gradient: "from-blue-400 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200",
  },
  {
    title: "Earn Rewards",
    description: "Earn real-time rewards automatically for providing liquidity and enabling trades.",
    icon: "🏆",
    gradient: "from-yellow-400 to-orange-500",
    bgGradient: "from-yellow-50 to-orange-50",
    borderColor: "border-yellow-200",
  },
  {
    title: "Social Alpha Feed",
    description: "Post real swaps with insights, explore others’ trades, and engage via reactions.",
    icon: "📢",
    gradient: "from-pink-400 to-rose-500",
    bgGradient: "from-pink-50 to-rose-50",
    borderColor: "border-pink-200",
  },
  {
    title: "Copy Trading",
    description: "Copy any real trade from the Alpha Feed directly into the swap UI with one click.",
    icon: "🧠",
    gradient: "from-purple-400 to-violet-500",
    bgGradient: "from-purple-50 to-violet-50",
    borderColor: "border-purple-200",
  },
  {
    title: "Reputation Engine",
    description: "Get scored based on your trade volume, profit %, LP activity, and social credibility.",
    icon: "⭐",
    gradient: "from-green-400 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    borderColor: "border-green-200",
  },
];



  useEffect(() => {
    const fetchUser = async () => {
      if (!address) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/users/wallet/${address}`);
        setUserId(res.data._id);
      } catch (err) {
        console.error("Failed to fetch user ID", err);
      }
    };

    fetchUser();
  }, [address]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section
        onMouseMove={setMouseCoordsFromSection}
        className="relative overflow-hidden min-h-screen flex items-center justify-center"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            style={{ y: y1 }}
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
          />
          <motion.div 
            style={{ y: y2 }}
            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-400/5 to-blue-400/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            {/* 3D Logo */}
            <div className="flex justify-center items-center mb-8">
              <div className="relative">
                <MetaCowModel mouse={mouse} />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-2xl -z-10" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MetaCow
              </span>
              <span className="text-slate-800"> DEX</span>
            </h1>

            {/* Subheading */}
           <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8 font-medium">
  Swap tokens, earn rewards, copy top wallets, and grow your DeFi reputation — all in one on-chain social DEX.
</p>


        
            {/* Search Component */}
            <div className="mb-8">
              <SearchFollow currentUserId={userId} />
            </div>

            {/* CTA Buttons */}
          <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.6 }}
  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
>
  {/* Start Trading Button */}
  <Link
    to="/swap"
    className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
  >
    <span className="flex items-center gap-2">
      🚀 Start Trading
      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </span>
  </Link>

  {/* Add Liquidity Button */}
  <Link
    to="/liquidity"
    className="group bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:border-purple-300 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
  >
    <span className="flex items-center gap-2">
      💧 Add Liquidity
      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </span>
  </Link>

  {/* Alpha Feed Button */}
  <Link
    to="/social"
    className="group bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-pink-400/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
  >
    <span className="flex items-center gap-2">
      📢 Alpha Feed
      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </span>
  </Link>
</motion.div>

          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">MetaCow</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of decentralized trading with our cutting-edge technology and unparalleled features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`group bg-gradient-to-br ${feature.bgGradient} p-8 rounded-3xl border ${feature.borderColor} hover:shadow-2xl hover:shadow-slate-400/20 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className={`bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              How It <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Get started with MetaCow in just three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Connect your MetaMask or any Web3 wallet to get started with trading.",
                icon: "🔗"
              },
              {
                step: "02",
                title: "Select Tokens",
                description: "Choose the tokens you want to trade from our extensive list of supported assets.",
                icon: "🪙"
              },
              {
                step: "03",
                title: "Execute Trade",
                description: "Review your transaction and execute with lightning-fast speed and minimal fees.",
                icon: "⚡"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400/5 to-blue-400/5" />
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400/15 to-blue-400/15 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-400/3 to-blue-400/3 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-800">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of traders who trust MetaCow for their DeFi needs.
              {isConnected
                ? " You're all set to begin your trading journey!"
                : " Connect your wallet to get started."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/swap"
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  🔄 Start Swapping
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                to="/create-pair"
                className="group bg-white/80 backdrop-blur-sm border-2 border-purple-200 text-purple-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:border-purple-300 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">
                  ➕ Create New Pair
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400/3 to-blue-400/3" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-purple-400/8 to-blue-400/8 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={metaCowLogo} alt="MetaCow" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                MetaCow DEX
              </span>
            </div>
            <p className="text-slate-700 mb-8 text-lg">
              Built with ❤️ for the DeFi community
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 mb-8">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>🌐 Ethereum Network</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>⚡ Powered by MetaMask SDK</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                <span>🔒 Audited & Secure</span>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-300">
              <p className="text-slate-500 text-sm">
                © 2025 MetaCow DEX. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}