import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useWallet } from "../contexts/WalletContext";
import PostCard from "../components/PostCard";
import SocialFeed from "../components/profile/SocialFeed";
import PostComposer from "../components/PostComposer";

export default function SocialPage() {
  const { walletData } = useWallet();
  const wallet = walletData?.address;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [recentSwaps, setRecentSwaps] = useState([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [following, setFollowing] = useState([]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/wallet/${wallet}`);
      setUser(res.data);
      const followRes = await axios.get(`http://localhost:5000/api/follow/following/${res.data._id}`);
      setFollowing(followRes.data.map((u) => u._id));
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  }, [wallet]);

  const fetchPosts = useCallback(async () => {
    try {
      setFetching(true);
      const res = await axios.get("http://localhost:5000/api/posts");
      const data = Array.isArray(res.data) ? res.data : res.data?.posts || [];
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setFetching(false);
    }
  }, []);

  const fetchRecentSwaps = useCallback(async () => {
    if (!wallet) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/swaps/recent?user=${wallet}`);
      setRecentSwaps(res.data || []);
    } catch (err) {
      console.error("Failed to fetch recent swaps", err);
    }
  }, [wallet]);

  const createPost = async () => {
    if (!wallet || !content.trim()) return;
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/posts", {
        wallet,
        content,
      });
      setContent("");
      await fetchPosts();
    } catch (err) {
      console.error("Post creation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const createPostFromSwap = async (txHash, content = "") => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/posts/from-swap", {
        wallet,
        content,
        txHash,
      });
      await fetchPosts();
    } catch (err) {
      console.error("Post from swap failed", err);
    } finally {
      setLoading(false);
    }
  };

  const search = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?query=${query}`);
      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const followUser = async (targetUserId) => {
    try {
      await axios.post(`http://localhost:5000/api/follow/follow/${targetUserId}`, {
        followerId: user._id,
      });
      setFollowing((prev) => [...prev, targetUserId]);
    } catch (err) {
      console.error("Follow failed", err?.response?.data || err);
    }
  };

  const unfollowUser = async (targetUserId) => {
    try {
      await axios.delete(`http://localhost:5000/api/follow/unfollow/${targetUserId}`, {
        data: { followerId: user._id },
      });
      setFollowing((prev) => prev.filter((id) => id !== targetUserId));
    } catch (err) {
      console.error("Unfollow failed", err?.response?.data || err);
    }
  };

  useEffect(() => {
    if (wallet) {
      fetchUser();
      fetchPosts();
      fetchRecentSwaps();
    }
  }, [wallet, fetchUser, fetchPosts, fetchRecentSwaps]);

  const truncate = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
        🌐 MetaCow Social
      </h1>

  <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6">
  {/* Left (main feed) */}
  <div className="lg:col-span-2 space-y-6">
    {wallet && user && <PostComposer wallet={wallet} user={user} refreshPosts={fetchPosts} />}

    {fetching ? (
      <div className="text-center text-gray-400">📡 Loading alpha...</div>
    ) : posts.length > 0 ? (
      posts.map((post) => (
        <PostCard key={post._id} post={post} refresh={fetchPosts} userWallet={wallet} />
      ))
    ) : (
      <div className="text-center text-gray-400">
        No insights yet. Be the first to post!
      </div>
    )}
  </div>

  {/* Right (search + feed) */}
  <div className="space-y-6 lg:sticky lg:top-24">
    {/* Discover & Follow */}
    <div className="bg-white rounded-xl shadow border border-purple-100 p-4 w-full">
      <h3 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
        🔍 Discover & Follow
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-1.5 text-sm border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
          placeholder="Search by username"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={search}
          className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600"
        >
          Search
        </button>
      </div>

      {results.length > 0 ? (
        <ul className="mt-3 space-y-2 max-h-52 overflow-y-auto">
          {results.map((user) => (
            <li key={user._id} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt="pfp"
                  className="w-6 h-6 rounded-full"
                />
                <span>{user.username}</span>
              </div>
              {following.includes(user._id) ? (
                <button
                  onClick={() => unfollowUser(user._id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => followUser(user._id)}
                  className="text-xs text-purple-600 hover:underline"
                >
                  Follow
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 mt-3">No users found yet.</p>
      )}
    </div>

    {/* Social Feed */}
    <SocialFeed wallet={wallet} />
  </div>
</div>

    </div>
  );
}
