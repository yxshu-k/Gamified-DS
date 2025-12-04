import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { leaderboardAPI } from "../utils/api";
import Avatar from "./Avatar";

// Level & XP helpers – must match backend, leaderboard, and dashboard
// Level 1:   0   - 99 XP
// Level 2:   100 - 299 XP
// Level 3:   300 - 499 XP
// Level 4:   500 - 699 XP
// ... each new level needs +200 XP
const calculateLevel = (xp = 0) => {
  const normalizedXP = Math.max(0, xp);

  if (normalizedXP < 100) {
    return 1;
  }

  return Math.floor((normalizedXP - 100) / 200) + 2;
};

// Total XP required to *reach* a given level
const xpForLevel = (level) => {
  if (level <= 1) return 0;
  return 100 + (level - 2) * 200;
};

// Helper function to get XP progress for current level
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

export default function ProfilePanel({ isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchLeaderboard();
    }
  }, [isOpen, isAuthenticated]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.getLeaderboard(null);
      if (response && response.success) {
        setPlayers(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching leaderboard for profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get current user's rank
  const currentUserRank = useMemo(() => {
    if (!user || players.length === 0) return null;
    const index = players.findIndex((p) => p.username === user.username);
    return index >= 0 ? index + 1 : null;
  }, [players, user]);

  const currentPlayerDetails = useMemo(() => {
    if (!user) return null;
    return players.find((p) => p.username === user.username) || null;
  }, [players, user]);

  const currentXP = currentPlayerDetails?.xp || 0;
  const currentLevel = currentPlayerDetails
    ? currentPlayerDetails.level || calculateLevel(currentXP)
    : 1;
  const xpProgress = getXPProgress(currentXP, currentLevel);
  const maskedPassword = user?.password || "••••••••";
  // For "Total Quiz Score" we want only quiz points (Stack + Array), not story missions
  const totalQuizScore =
    (currentPlayerDetails?.stackScore || 0) +
    (currentPlayerDetails?.arrayScore || 0);
  const stackScore = currentPlayerDetails?.stackScore || 0;
  const arrayScore = currentPlayerDetails?.arrayScore || 0;
  const stackMissionScore = currentPlayerDetails?.stackMissionScore || 0;
  const arrayMissionScore = currentPlayerDetails?.arrayMissionScore || 0;
  const missionTotal = currentPlayerDetails?.missionTotal || (stackMissionScore + arrayMissionScore);
  const stackPower = currentPlayerDetails?.stackOverallScore || (stackScore + stackMissionScore);
  const arrayPower = currentPlayerDetails?.arrayOverallScore || (arrayScore + arrayMissionScore);
  const totalQuizzes = currentPlayerDetails?.totalQuizzes || 0;
  const totalMissions = currentPlayerDetails?.totalMissions || 0;

  const profileFields = [
    { label: "Username", value: user?.username || "Guest" },
    { label: "Email", value: user?.email || "Not provided" },
    { label: "Password", value: maskedPassword },
    { label: "Rank", value: currentUserRank ? `#${currentUserRank}` : "Not ranked yet" },
    { label: "Quiz Score (Total)", value: `${totalQuizScore} pts` },
    { label: "Stack Quiz Best", value: `${stackScore} pts` },
    { label: "Array Quiz Best", value: `${arrayScore} pts` },
    { label: "Story Score (Total)", value: `${missionTotal} pts` },
    { label: "Stack Story Best", value: `${stackMissionScore} pts` },
    { label: "Array Story Best", value: `${arrayMissionScore} pts` },
    { label: "Stack Power (Quiz+Story)", value: `${stackPower} pts` },
    { label: "Array Power (Quiz+Story)", value: `${arrayPower} pts` },
    { label: "Quizzes Played", value: `${totalQuizzes}` },
    { label: "Story Missions Cleared", value: `${totalMissions}` },
  ];

  if (!isOpen || !isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white p-6 flex items-center gap-4">
          <div className="rounded-2xl shadow-xl">
            <Avatar user={user} size={64} className="rounded-2xl" />
          </div>
          <div>
            <p className="text-sm text-white/70 uppercase tracking-[0.4em]">Player Profile</p>
            <h3 className="text-2xl font-extrabold">{user.username}</h3>
            <p className="text-sm text-white/80">
              {currentUserRank ? `Currently #${currentUserRank}` : "Looking to make a mark"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-white/70 hover:text-white transition text-2xl leading-none"
            aria-label="Close profile panel"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-5 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profile data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profileFields.map((field) => (
                  <div key={field.label} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">{field.label}</p>
                    <p className="text-base font-semibold text-blue-950 break-words">{field.value}</p>
                  </div>
                ))}
              </div>
              {currentPlayerDetails ? (
                <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-orange-50 p-5 shadow-inner">
                  <div className="flex items-center justify-between text-sm font-semibold text-rose-900 mb-2">
                    <span>Level {currentLevel}</span>
                    <span>{xpProgress.current} / {xpProgress.needed} XP</span>
                  </div>
                  <div className="w-full h-3 bg-white/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400"
                      style={{ width: `${xpProgress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-rose-900/70 mt-2">Keep solving quizzes to level up faster.</p>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-3xl p-4">
                  Play and submit quizzes to unlock your detailed stats.
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/dashboard');
                  }}
                  className="w-full sm:w-auto px-5 py-2 rounded-2xl border border-pink-200 text-pink-700 font-semibold hover:bg-pink-50 transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2 rounded-2xl bg-pink-600 text-white font-semibold shadow-md hover:bg-pink-700 transition"
                >
                  Close Panel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

