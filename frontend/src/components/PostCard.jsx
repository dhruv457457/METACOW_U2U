import axios from "axios";
import { useWallet } from "../contexts/WalletContext";
import { useState } from "react";
import { ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react";

export default function PostCard({ post, refresh }) {
  const { walletData } = useWallet();
  const wallet = walletData?.address;
  const [liking, setLiking] = useState(false);

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
            <p className="text-sm font-semibold text-purple-700">
              {post.username || truncate(post.wallet)}
            </p>
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
