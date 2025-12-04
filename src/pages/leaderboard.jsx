import React, { useEffect, useMemo, useState } from "react";
import { leaderboardAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";

const podiumDescriptors = [
  {
    title: "Champion",
    badge: "bg-pink-100 text-pink-700",
    accent: "text-pink-700",
    backdrop: "from-pink-50 via-white to-sky-50",
    ring: "ring-pink-200",
  },
  {
    title: "Runner-Up",
    badge: "bg-blue-100 text-blue-700",
    accent: "text-blue-700",
    backdrop: "from-blue-50 via-white to-sky-50",
    ring: "ring-blue-200",
  },
  {
    title: "Rising Star",
    badge: "bg-sky-100 text-sky-700",
    accent: "text-sky-700",
    backdrop: "from-sky-50 via-white to-pink-50",
    ring: "ring-sky-200",
  },
];

// Helper function to calculate level from XP using the same thresholds as backend:
// Level 1:   0   - 99 XP
// Level 2:   100 - 299 XP
// Level 3:   300 - 499 XP
// Level 4:   500 - 699 XP
// ... and so on (each new level requires +200 XP)
const calculateLevel = (xp = 0) => {
  const normalizedXP = Math.max(0, xp);

  if (normalizedXP < 100) {
    return 1;
  }

  return Math.floor((normalizedXP - 100) / 200) + 2;
};

// XP needed to *reach* a given level (used for progress bar)
const xpForLevel = (level) => {
  if (level <= 1) return 0;
  return 100 + (level - 2) * 200;
};

// Helper function to get XP progress for current level
// Uses same logic as Dashboard/Profile: progress within this level only
const getXPProgress = (xp = 0, level = 1) => {
  const xpForCurrentLevel = xpForLevel(level);
  const xpForNextLevel = xpForLevel(level + 1);
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  return {
    current: Math.max(0, xpInCurrentLevel),
    needed: xpNeeded,
    percentage: xpNeeded > 0 ? Math.min((xpInCurrentLevel / xpNeeded) * 100, 100) : 100
  };
};


// Get rank badge with proper positioning
const getRankBadge = (rank) => {
  if (rank === 1) return { icon: '🥇', color: 'from-yellow-400 to-yellow-600', glow: 'shadow-yellow-400', label: '1st Place' };
  if (rank === 2) return { icon: '🥈', color: 'from-gray-300 to-gray-500', glow: 'shadow-gray-400', label: '2nd Place' };
  if (rank === 3) return { icon: '🥉', color: 'from-orange-400 to-orange-600', glow: 'shadow-orange-400', label: '3rd Place' };
  return { icon: `${rank}`, color: 'from-blue-400 to-blue-600', glow: '', label: `${rank}${rank === 11 || rank === 12 || rank === 13 ? 'th' : rank % 10 === 1 ? 'st' : rank % 10 === 2 ? 'nd' : rank % 10 === 3 ? 'rd' : 'th'} Place` };
};

const getOverallScoreByTopic = (player, topic) => {
  if (!player) return 0;
  if (topic === 'Stack') {
    return (
      player.stackOverallScore ||
      ((player.stackScore || 0) + (player.stackMissionScore || 0))
    );
  }
  if (topic === 'Array') {
    return (
      player.arrayOverallScore ||
      ((player.arrayScore || 0) + (player.arrayMissionScore || 0))
    );
  }
  return player.total || 0;
};

const getMissionScoreByTopic = (player, topic) => {
  if (!player) return 0;
  if (topic === 'Stack') return player.stackMissionScore || 0;
  if (topic === 'Array') return player.arrayMissionScore || 0;
  return (
    player.missionTotal ||
    (player.stackMissionScore || 0) + (player.arrayMissionScore || 0)
  );
};

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(""); // "Stack", "Array", or "" for all
  const [timeFilter, setTimeFilter] = useState("all"); // "all", "weekly", "daily"
  const [isMobile, setIsMobile] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchLeaderboard();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTopic, timeFilter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await leaderboardAPI.getLeaderboard(
        selectedTopic || null
      );
      
      if (response && response.success) {
        setPlayers(response.data || []);
        setTotalPlayers(response.totalPlayers || (response.data?.length || 0));
      } else {
        setPlayers([]);
        setTotalPlayers(0);
        setError(response?.message || "No data available");
      }
    } catch (err) {
      console.error("Leaderboard error:", err);
      setError(err.message || "Failed to load leaderboard. Please check your connection.");
      setPlayers([]);
      setTotalPlayers(0);
    } finally {
      setLoading(false);
    }
  };

  // Get current user's rank (properly calculated)
  const currentUserRank = user && players.length > 0
    ? (() => {
        const index = players.findIndex((p) => p.username === user.username);
        return index >= 0 ? index + 1 : null;
      })()
    : null;

  // Get current user's details for rank display
  const currentPlayerDetails = useMemo(() => {
    if (!user) return null;
    return players.find((p) => p.username === user.username) || null;
  }, [players, user]);

  const normalizedSearch = searchKeyword.trim().toLowerCase();
  const filteredPlayers = useMemo(() => {
    if (normalizedSearch.length === 0) return players;
    return players.filter((player) =>
      (player.username || "").toLowerCase().includes(normalizedSearch)
    );
  }, [players, normalizedSearch]);
  const podiumPlayers = filteredPlayers.slice(0, 3);
  const remainingPlayers = filteredPlayers.slice(3);
  const isSearchActive = normalizedSearch.length > 0;
  const hasSearchResults = filteredPlayers.length > 0;

  const handleSearch = (event) => {
    if (event) event.preventDefault();
    setSearchKeyword(searchInput.trim());
  };

  // Initial loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-semibold">Loading leaderboard...</p>
          <p className="mt-2 text-gray-500 text-sm">Fetching the latest rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="container mx-auto px-4">
        {/* Navigation Bar */}
        <div className="bg-pink-100/90 backdrop-blur border border-pink-200 rounded-2xl shadow-lg shadow-pink-100/40 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white text-2xl flex items-center justify-center shadow-md">
              🏆
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Elite Rankings</p>
              <h2 className="text-lg sm:text-xl font-extrabold text-blue-900">Gamified Arena</h2>
            </div>
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl border border-pink-200 bg-white px-4 py-2 hover:shadow-lg transition"
            >
              <Avatar user={user} size={40} />
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-900">{user.username}</p>
                <span className="text-xs text-gray-500">
                  {currentUserRank ? `Rank #${currentUserRank}` : "Go to Dashboard"}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-2 rounded-2xl bg-pink-600 text-white font-semibold shadow-lg hover:bg-pink-700 transition"
            >
              Login to Compete
            </button>
          )}
        </div>
        {/* Header with Stats */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-950 mb-2">
          Leaderboard
      </h1>
          <p className="text-gray-600 text-sm sm:text-lg mb-2 sm:mb-4 px-2">
            Compete with learners worldwide and climb the ranks!
          </p>
          
          {/* Player Count Badge */}
          {totalPlayers > 0 && (
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 sm:px-6 py-2 shadow-lg mb-4 text-sm sm:text-base">
              <span className="text-xl sm:text-2xl">👥</span>
              <span className="font-bold text-gray-800">
                <span className="text-blue-600">{totalPlayers}</span> {totalPlayers === 1 ? 'Player' : 'Players'} Competing
              </span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-sky-50 rounded-2xl shadow-lg shadow-sky-100/60 p-4 sm:p-6 mb-4 sm:mb-8 border border-sky-100 space-y-3">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            {/* Topic Filter */}
            <div className="flex gap-1 sm:gap-2 bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setSelectedTopic("")}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md font-semibold text-xs sm:text-base transition-all ${
                  selectedTopic === ""
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTopic("Stack")}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md font-semibold text-xs sm:text-base transition-all ${
                  selectedTopic === "Stack"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Stack
              </button>
              <button
                onClick={() => setSelectedTopic("Array")}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md font-semibold text-xs sm:text-base transition-all ${
                  selectedTopic === "Array"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                Array
              </button>
            </div>
          </div>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔎</span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search players by username"
                aria-label="Search players"
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md hover:bg-blue-700 transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearchKeyword("");
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-100 transition"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Not Logged In Message */}
        {!isAuthenticated && (
          <div className="bg-white/90 border border-blue-200 rounded-2xl p-6 mb-6 text-center shadow-lg shadow-blue-100/60">
            <p className="text-blue-800 font-semibold text-lg mb-2">
              ⚠️ Login to see your rank and compete!
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Login Now
            </button>
          </div>
        )}

        {error && (
          <div className="bg-white border border-red-200 text-red-600 px-6 py-4 rounded-2xl mb-6 text-center font-semibold shadow-md shadow-red-100/60">
            {error}
          </div>
        )}

        {/* Empty State - Initial Message */}
        {players.length === 0 && !loading && (
          <div className="bg-white/90 border border-white rounded-3xl shadow-2xl shadow-emerald-100/50 p-6 sm:p-12 text-center backdrop-blur">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🎯</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Welcome to the Leaderboard! 🎉
            </h2>
            <p className="text-gray-600 text-base sm:text-xl mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
              No players have completed quizzes yet. Be the first to make your mark!
            </p>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <p className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">📚 How to get started:</p>
              <ol className="text-left max-w-md mx-auto space-y-1 sm:space-y-2 text-gray-600 text-xs sm:text-sm">
                <li>1. Complete quizzes on Stack or Array topics</li>
                <li>2. Earn XP and level up</li>
                <li>3. Climb the leaderboard ranks</li>
                <li>4. Compete with other learners!</li>
              </ol>
            </div>
            {!isAuthenticated ? (
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg hover:shadow-xl transition w-full sm:w-auto"
              >
                Login to Start Competing 🚀
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => navigate('/stack')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg hover:shadow-xl transition"
                >
                  Start Quiz! 🎓
                </button>
                {isMobile && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg hover:shadow-xl transition"
                  >
                    📊 Dashboard
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard with Players */}
        {players.length > 0 && (
          <div className="space-y-6">
            {isSearchActive && !hasSearchResults && (
              <div className="bg-white/90 border border-blue-100 text-blue-800 rounded-2xl p-4 text-center shadow-md">
                <p className="font-semibold">No players found for "{searchKeyword}".</p>
                <p className="text-sm text-gray-500">Try another name or clear the search filter.</p>
              </div>
            )}
            {/* Top 3 Podium - Only show if 3+ players */}
            {podiumPlayers.length === 3 && (
              <div className="bg-white/95 border border-white rounded-3xl shadow-xl shadow-blue-100/70 p-4 sm:p-6 mb-6 sm:mb-10">
                <div className="flex items-center justify-between mb-4 text-xs sm:text-sm text-gray-500 uppercase tracking-[0.25em]">
                  <span>Top Podium</span>
                  <span>Power Score</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-4 sm:gap-8 order-none">
                  {[
                    // Ensure mobile view shows 1st, 2nd, 3rd in order,
                    // while desktop still highlights the champion at the center.
                    {
                      player: podiumPlayers[0],
                      rank: 1,
                      size: "text-xl",
                      height: "h-36",
                      columnStyles: "order-1 sm:order-2 sm:self-end",
                    },
                    {
                      player: podiumPlayers[1],
                      rank: 2,
                      size: "text-lg",
                      height: "h-32",
                      columnStyles: "order-2 sm:order-1 sm:self-end sm:translate-y-2",
                    },
                    {
                      player: podiumPlayers[2],
                      rank: 3,
                      size: "text-base",
                      height: "h-28",
                      columnStyles: "order-3 sm:order-3 sm:self-end sm:translate-y-4",
                    },
                  ].map(({ player, rank, size, height, columnStyles }) => {
                    if (!player) return null;
                    const score = getOverallScoreByTopic(player, selectedTopic);
                    const missionScore = getMissionScoreByTopic(player, selectedTopic);
                    const level = player.level || calculateLevel(player.xp || 0);
                    const descriptor = podiumDescriptors[rank - 1];

                    return (
                      <div
                        key={rank}
                        className={`flex flex-col items-center text-center gap-3 sm:gap-4 ${columnStyles} w-full sm:w-auto`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-[11px] uppercase tracking-[0.2em] ${descriptor.accent}`}>
                            {descriptor.title}
                          </span>
                          <div className={`ring-2 ${descriptor.ring} rounded-full`}>
                            <Avatar user={{ username: player.username, email: player.email, avatar: player.avatar }} size={48} />
                          </div>
                          <h3 className={`${size === "text-xl" ? "text-lg sm:text-xl" : "text-base"} font-semibold text-blue-950`}>
                            {player.username || "Unknown"}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Level {level} · {player.xp || 0} XP
                          </p>
                        </div>
                        <div className="w-full">
                          <div
                            className={`mx-auto w-20 sm:w-24 rounded-2xl bg-gradient-to-b ${descriptor.backdrop} text-blue-900 font-extrabold flex flex-col items-center justify-center ${height} shadow-inner`}
                          >
                            <span className="text-xs uppercase tracking-[0.3em] text-blue-600/70">
                              Rank
                            </span>
                            <span className="text-3xl">{rank}</span>
                          </div>
                          <div className="mt-3 flex flex-col items-center gap-1">
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-xs shadow-md shadow-amber-300/40">
                              <span>⚡</span>
                              <span className="font-semibold">
                                {Number(score || 0).toLocaleString()} pts
                              </span>
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                              Skill power
                            </span>
                            <p className="text-[11px] text-slate-500 mt-1">
                              {selectedTopic === ""
                                ? `Story best · Stack ${player.stackMissionScore || 0} pts • Array ${player.arrayMissionScore || 0} pts`
                                : `Story mission best · ${missionScore} pts`}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Display for 1-2 Players */}
            {filteredPlayers.length > 0 && filteredPlayers.length < 3 && (
              <div className="bg-white/90 rounded-3xl shadow-xl shadow-blue-100/60 p-4 sm:p-8 mb-4 sm:mb-6 text-center border border-white">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  {players.length === 1 ? '🎯 First Player!' : '🏆 Early Leaders!'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {filteredPlayers.map((player, index) => {
                    const rank = index + 1;
                    const badge = getRankBadge(rank);
                    const level = player.level || calculateLevel(player.xp || 0);
                    const quizScore = getOverallScoreByTopic(player, selectedTopic);
                    const missionScore = getMissionScoreByTopic(player, selectedTopic);
                    return (
                      <div key={rank} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="text-4xl mb-2">{badge.icon}</div>
                        <div className="mx-auto mb-3">
                          <Avatar user={{ username: player.username, email: player.email, avatar: player.avatar }} size={64} />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{player.username || 'Unknown'}</h3>
                        <p className="text-2xl font-extrabold text-blue-600 mb-2">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/80 shadow-sm border border-blue-100 text-blue-700 text-base">
                            <span>⚡</span>
                            <span>
                              {Number(quizScore || 0).toLocaleString()}{" "}
                              pts
                            </span>
                          </span>
                        </p>
                        <p className="text-xs text-indigo-600 mb-2">
                          {selectedTopic === ""
                            ? `Story best · Stack ${player.stackMissionScore || 0} pts • Array ${player.arrayMissionScore || 0} pts`
                            : `Story mission best · ${missionScore} pts`}
                        </p>
                        <p className="text-xs text-gray-600">
                          Quizzes:{" "}
                          {selectedTopic === "Stack"
                            ? player.stackQuizzes || 0
                            : selectedTopic === "Array"
                            ? player.arrayQuizzes || 0
                            : player.totalQuizzes || 0}
                          {" · "}Story Missions:{" "}
                          {selectedTopic === "Stack"
                            ? player.stackMissions || 0
                            : selectedTopic === "Array"
                            ? player.arrayMissions || 0
                            : player.totalMissions || 0}
                        </p>
                        <div className="text-sm text-gray-600">
                          Level {level} • {player.xp || 0} XP
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-gray-600">
                  {players.length === 1 
                    ? "More players will appear here as they complete quizzes!"
                    : "Complete more quizzes to see the full podium!"}
                </p>
              </div>
            )}

            {/* Rest of Leaderboard (Rank 4+) */}
            {remainingPlayers.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2 text-sm text-gray-500 uppercase tracking-[0.2em]">
                  <span>Rank</span>
                  <span>Momentum</span>
                </div>
                {remainingPlayers.map((player, index) => {
                  if (!player) return null;
                  const rank = index + 4; // Start from 4th place
                  const level = player.level || calculateLevel(player.xp || 0);
                  const xpProgress = getXPProgress(player.xp || 0, level);
                  const isCurrentUser = user && player.username === user.username;
                  const quizScore = getOverallScoreByTopic(player, selectedTopic);
                  const missionScore = getMissionScoreByTopic(player, selectedTopic);

                  return (
                    <div
                      key={rank}
                      className={`bg-white/95 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                        isCurrentUser ? 'ring-2 ring-pink-200 bg-pink-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-blue-900 font-bold flex items-center justify-center">
                          {rank}
                        </div>
                        <Avatar user={{ username: player.username, email: player.email, avatar: player.avatar }} size={48} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-gray-900 truncate">{player.username}</h3>
                          {isCurrentUser && (
                            <span className="text-[10px] uppercase tracking-wide text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                          {player.streak > 0 && (
                            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              🔥 {player.streak}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Level {level} · {player.xp || 0} XP
                        </p>
                        <div className="mt-3">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full transition-all duration-500"
                              style={{ width: `${xpProgress.percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                            <span>{Math.round(xpProgress.current)} XP</span>
                            <span>{xpProgress.needed} XP</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right min-w-[110px]">
                        {selectedTopic === "" && (
                          <div className="text-[11px] text-gray-500 space-y-1">
                            <div>
                              Stack Quiz •{" "}
                              <span className="text-blue-600 font-semibold">
                                {player.stackScore || 0}
                              </span>
                            </div>
                            <div>
                              Stack Story •{" "}
                              <span className="text-blue-600 font-semibold">
                                {player.stackMissionScore || 0}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Quiz: {player.stackQuizzes || 0} · Story: {player.stackMissions || 0}
                            </div>
                            <div>
                              Array Quiz •{" "}
                              <span className="text-pink-600 font-semibold">
                                {player.arrayScore || 0}
                              </span>
                            </div>
                            <div>
                              Array Story •{" "}
                              <span className="text-pink-600 font-semibold">
                                {player.arrayMissionScore || 0}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Quiz: {player.arrayQuizzes || 0} · Story: {player.arrayMissions || 0}
                            </div>
                          </div>
                        )}
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md">
                          <span>⚡</span>
                          <span>
                            {Number(quizScore || 0).toLocaleString()}{" "}
                            pts
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-500 mt-1">
                          {selectedTopic === ""
                            ? `Story best · Stack ${player.stackMissionScore || 0} pts • Array ${player.arrayMissionScore || 0} pts`
                            : `Story mission best · ${missionScore} pts`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-4 sm:mt-8 text-center text-gray-600 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <p className="text-xs sm:text-sm font-semibold mb-2">
            {selectedTopic
              ? `📊 ${selectedTopic} Leaderboard - Based on ${selectedTopic} quiz + story performance`
              : "📊 Global Leaderboard - Combined Stack & Array quizzes + story missions"}
          </p>
          <p className="text-[10px] sm:text-xs text-gray-500">
            Complete quizzes to earn XP, level up, and climb the ranks! 🚀
            {totalPlayers > 0 && ` ${totalPlayers} ${totalPlayers === 1 ? 'player' : 'players'} competing.`}
          </p>
        </div>
      </div>
    </div>
  );
}