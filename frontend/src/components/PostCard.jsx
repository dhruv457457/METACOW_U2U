import axios from "axios";
import { useWallet } from "../contexts/WalletContext";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";
import { ethers } from "ethers";
import { FACTORY_ADDRESS, FACTORY_ABI, PAIR_ABI } from "../utils/constants";
import { Interface } from "ethers";

export default function PostCard({ post, refresh }) {
  const { walletData } = useWallet();
  const wallet = walletData?.address;
  const [liking, setLiking] = useState(false);
  const [reputation, setReputation] = useState(null);

  useEffect(() => {
    const fetchReputation = async () => {
      if (!post.wallet) return;
      try {
        // Connect to the user's wallet (or use a public provider if you don't need signing)
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
        const iface = new Interface(PAIR_ABI);
        const pairCount = await factory.allPairsLength();
        let totalScore = 0;

        for (let i = 0; i < pairCount; i++) {
          const pairAddr = await factory.allPairs(i);
          const pair = new ethers.Contract(pairAddr, PAIR_ABI, provider);

          const supportsReputation = iface.fragments.some((f) => f.name === "getReputationScore");
          if (!supportsReputation) continue;

          try {
            const score = await pair.getReputationScore(post.wallet);
            totalScore += Number(score);
          } catch (err) {
            // Ignore errors for pairs that don't support the function
          }
        }

        setReputation(totalScore);
      } catch (err) {
        setReputation(null);
      }
    };

    fetchReputation();
  }, [post.wallet]);

  const handleLike = async () => {
    if (!wallet) return;
    try {
      setLiking(true);
      await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, { wallet });
      refresh();
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      setLiking(false);
    }
  };

  const handleDislike = async () => {
    if (!wallet) return;
    try {
      setLiking(true);
      await axios.post(`http://localhost:5000/api/posts/${post._id}/dislike`, { wallet });
      refresh();
    } catch (err) {
      console.error("Dislike failed", err);
    } finally {
      setLiking(false);
    }
  };

  const truncate = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow hover:shadow-lg transition-all">
      {/* Header: Profile */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={post.profileImage || "/assets/default-avatar.png"}
            alt="User"
            className="w-9 h-9 rounded-full object-cover border"
          />
          <div>
            <div className="flex items-center gap-2">
              {reputation !== null && (
                <span className="text-xs text-blue-600 font-semibold">
                  ⭐ {reputation}
                </span>
              )}
              <p className="text-sm font-semibold text-purple-700">
                {post.username || truncate(post.wallet)}
              </p>
            </div>
            <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 text-base whitespace-pre-wrap mb-3">{post.content}</p>

      {/* Swap Info (if exists) */}
      {(post.tokenIn && post.tokenOut) && (
        <div className="bg-purple-50 text-sm text-purple-800 p-3 rounded-xl mb-3 border border-purple-200">
          <p className="font-medium">
            Swap: <span className="font-mono">{post.tokenIn.slice(0, 6)}... → {post.tokenOut.slice(0, 6)}...</span>
          </p>
          <p className="text-xs mt-1 text-gray-500 font-mono">
            {post.amountIn} → {post.amountOut}
          </p>
          {post.txHash && (
            <a
              href={`https://testnet.bscscan.com/tx/${post.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-blue-600 mt-2 hover:underline"
            >
              <ExternalLink size={14} className="mr-1" />
              View Tx
            </a>
          )}
        </div>
      )}

      {/* Like / Dislike Buttons */}
      <div className="flex justify-between items-center text-sm mt-2">
        <div className="flex gap-4 text-purple-600">
          <button
            onClick={handleLike}
            disabled={liking}
            className="flex items-center gap-1 hover:text-purple-800"
          >
            <ThumbsUp size={16} /> {post.likes?.length || 0}
          </button>
          <button
            onClick={handleDislike}
            disabled={liking}
            className="flex items-center gap-1 text-red-500 hover:text-red-700"
          >
            <ThumbsDown size={16} /> {post.dislikes?.length || 0}
          </button>
        </div>
      </div>
    </div>
  );
}
