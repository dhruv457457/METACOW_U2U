import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useWallet } from "../contexts/WalletContext";
import PostCard from "../components/PostCard";
import SocialFeed from "../components/profile/SocialFeed";

export default function SocialPage() {
  const { walletData } = useWallet();
  const wallet = walletData?.address;

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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
    }
  }, [wallet, fetchUser, fetchPosts]);

  const truncate = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-10 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
        🌐 MetaCow Social
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Alpha Feed */}
        <div className="lg:col-span-2 space-y-6">
          {wallet && user && (
            <div className="bg-white/90 border border-purple-100 shadow-xl rounded-2xl p-6 transition hover:shadow-2xl">
              <div className="flex items-start gap-4">
                <img
                  src={user.profileImage || "/assets/default-avatar.png"}
                  alt="profile"
                  className="w-10 h-10 rounded-full border border-purple-300 shadow-sm object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {user.username || truncate(wallet)}
                  </p>
                  <textarea
                    className="w-full border border-gray-300 p-3 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white/90 placeholder:text-gray-400"
                    rows={3}
                    placeholder="Drop your alpha, trade strategy or thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={createPost}
                      disabled={loading}
                      className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
                    >
                      {loading ? "Posting..." : "🚀 Share Alpha"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {fetching ? (
            <div className="text-center text-gray-400">📡 Loading alpha...</div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} refresh={fetchPosts} />
            ))
          ) : (
            <div className="text-center text-gray-400">
              No insights yet. Be the first to post!
            </div>
          )}
        </div>

        {/* Right: SearchFollow + SocialFeed */}
        <div className="space-y-6">
          {/* Compact Search */}
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

          {/* Feed */}
          <SocialFeed wallet={wallet} />
        </div>
      </div>
    </div>
  );
}
