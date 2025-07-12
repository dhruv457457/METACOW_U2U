import { useState, useEffect } from "react";
import axios from "axios";

const SWAPS_PER_PAGE = 5;

export default function PostComposer({ wallet, user, refreshPosts }) {
  const [content, setContent] = useState("");
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSwap, setSelectedSwap] = useState(null);

  const truncate = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  useEffect(() => {
    const fetchRecentSwaps = async () => {
      if (!wallet) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/swaps/recent?user=${wallet}`);
        setRecentSwaps(res.data || []);
      } catch (err) {
        console.error("Failed to fetch recent swaps", err);
      }
    };
    fetchRecentSwaps();
  }, [wallet]);

  const handlePost = async () => {
    if (!wallet || !content.trim()) return;
    try {
      setLoading(true);
      if (selectedSwap) {
        await axios.post("http://localhost:5000/api/posts/from-swap", {
          wallet,
          content,
          txHash: selectedSwap.txHash,
        });
      } else {
        await axios.post("http://localhost:5000/api/posts", {
          wallet,
          content,
        });
      }
      setContent("");
      setSelectedSwap(null);
      refreshPosts?.();
    } catch (err) {
      console.error("Post creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(recentSwaps.length / SWAPS_PER_PAGE);
  const startIdx = (currentPage - 1) * SWAPS_PER_PAGE;
  const currentSwaps = recentSwaps.slice(startIdx, startIdx + SWAPS_PER_PAGE);

  return (
    <div className="bg-white/90 border border-purple-100 shadow-xl rounded-2xl p-6 transition hover:shadow-2xl">
      <div className="flex items-start gap-4">
        <img
          src={user?.profileImage || "/assets/default-avatar.png"}
          alt="profile"
          className="w-10 h-10 rounded-full border border-purple-300 shadow-sm object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-700 mb-1">
            {user?.username || truncate(wallet)}
          </p>

          <textarea
            className="w-full border border-gray-300 p-3 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/90 placeholder:text-gray-400"
            rows={3}
            placeholder="Drop your alpha, trade strategy or thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {recentSwaps.length > 0 && (
            <div className="mt-4">
              <label className="text-xs font-medium text-gray-500 mb-1 block">💱 Attach a Swap (optional)</label>
              <select
                className="w-full border border-purple-200 rounded-md text-sm px-3 py-2"
                value={selectedSwap?.txHash || ""}
                onChange={(e) =>
                  setSelectedSwap(
                    recentSwaps.find((s) => s.txHash === e.target.value) || null
                  )
                }
              >
                <option value="">-- No Swap Selected --</option>
                {currentSwaps.map((swap) => (
                  <option key={swap.txHash} value={swap.txHash}>
                    {`Swapped ${swap.inputAmount} ${swap.inputToken} → ${swap.outputAmount} ${swap.outputToken}`}
                  </option>
                ))}
              </select>

              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-xs px-2 py-1 border rounded bg-gray-50 hover:bg-gray-100"
                  >
                    ◀ Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-xs px-2 py-1 border rounded bg-gray-50 hover:bg-gray-100"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={handlePost}
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? "Posting..." : "📢 Share Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
