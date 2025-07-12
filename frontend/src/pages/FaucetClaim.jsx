import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";
import { toast } from "react-hot-toast";
import { tokenList } from "../utils/constants";

const FAUCET_ADDRESS = "0xD1504b93610AaA68C1F93165120b7b2B906ae9A8";

const FAUCET_ABI = [
  "function claim(address token) external",
  "function timeUntilNextClaim(address user, address token) external view returns (uint256)",
];

const addTokenToWallet = async (token) => {
  if (!window.ethereum) return;

  try {
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals || 18,
          image: token.logoURI || "",
        },
      },
    });

    if (wasAdded) toast.success(`${token.symbol} added to wallet ✅`);
    else toast.error("Token addition rejected.");
  } catch (err) {
    console.error("MetaMask watchAsset error:", err);
    toast.error("Failed to add token to wallet.");
  }
};

export default function FaucetClaim() {
  const { walletData } = useWallet();
  const address = walletData?.address;
  const [selectedToken, setSelectedToken] = useState(tokenList[0]);
  const [cooldown, setCooldown] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCooldown = async () => {
    if (!window.ethereum || !address) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, provider);
      const remaining = await contract.timeUntilNextClaim(address, selectedToken.address);
      setCooldown(Number(remaining));
    } catch (err) {
      console.error("Cooldown fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchCooldown();
  }, [selectedToken, address]);

  const handleClaim = async () => {
    if (!window.ethereum || !address) return;
    try {
      setLoading(true);
      toast.loading("Claiming tokens...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, signer);
      const tx = await contract.claim(selectedToken.address);
      await tx.wait();
      toast.dismiss();
      toast.success(`🎉 Claimed 10 ${selectedToken.symbol}`);
      fetchCooldown();
    } catch (err) {
      toast.dismiss();
      toast.error("❌ Claim failed or already claimed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return `${hrs}h ${mins}m ${sec}s`;
  };

  return (
    <div className="min-h-screen py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-purple-100">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            🐄 MetaCow Faucet
          </h2>

          {/* Token Dropdown + Cooldown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                Select a Token
              </label>
              <select
                className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-300"
                value={selectedToken.symbol}
                onChange={(e) =>
                  setSelectedToken(tokenList.find((t) => t.symbol === e.target.value))
                }
              >
                {tokenList.map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              {cooldown === null ? (
                <p className="text-gray-500">🔄 Checking cooldown...</p>
              ) : cooldown === 0 ? (
                <p className="text-green-600 font-semibold">
                  ✅ Ready to claim 10 {selectedToken.symbol}!
                </p>
              ) : (
                <p className="text-yellow-600 font-medium">
                  ⏳ Cooldown: {formatTime(cooldown)}
                </p>
              )}
            </div>
          </div>

          {/* Claim Button */}
          <button
            onClick={handleClaim}
            disabled={cooldown > 0 || loading}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
              cooldown > 0 || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            }`}
          >
            {loading ? "⏳ Claiming..." : `🎁 Claim 10 ${selectedToken.symbol}`}
          </button>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* Add to Wallet CTA Section */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Want to see {selectedToken.symbol} in your wallet?</p>
            <button
              onClick={() => addTokenToWallet(selectedToken)}
              className="inline-flex items-center justify-center px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition"
            >
              🦊 Add {selectedToken.symbol} to MetaMask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
