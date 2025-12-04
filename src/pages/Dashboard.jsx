import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { leaderboardAPI } from "../utils/api";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchProgress();
  }, [isAuthenticated, navigate]);

  const fetchProgress = async () => {
    try {
      const response = await leaderboardAPI.getMyProgress();
      if (response.success) {
        setProgress(response.data);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // Level & XP helpers – must match backend and leaderboard page
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

  const getXPProgress = (xp = 0, level = 1) => {
    const xpForCurrentLevel = xpForLevel(level);
    const xpForNextLevel = xpForLevel(level + 1);
    const xpInCurrentLevel = xp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    return {
      current: Math.max(0, xpInCurrentLevel),
      needed: xpNeeded,
      percentage:
        xpNeeded > 0
          ? Math.min((xpInCurrentLevel / xpNeeded) * 100, 100)
          : 100,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  const level = progress ? calculateLevel(progress.xp || 0) : 1;
  const xpProgress = progress ? getXPProgress(progress.xp || 0, level) : { current: 0, needed: 100, percentage: 0 };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-pink-100/80 border border-pink-200 rounded-3xl p-6 sm:p-8 shadow-lg shadow-pink-100/50 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-500 mb-2">
            Your Learning Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-950">
          Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Track your XP, keep your streak alive, and jump into new challenges.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Current Level", value: level, accent: "from-pink-500 to-rose-600" },
            { label: "Total XP", value: `${progress?.xp || 0}`, accent: "from-sky-500 to-blue-600", subtitle: `${Math.max(0, xpProgress.needed - xpProgress.current)} XP to next level` },
            {
              label: "Stack Quiz Best",
              value: `${progress?.stackScore || 0} pts`,
              accent: "from-amber-400 to-orange-500",
              subtitle: `${progress?.stackQuizzes || 0} quizzes`,
            },
            {
              label: "Array Quiz Best",
              value: `${progress?.arrayScore || 0} pts`,
              accent: "from-emerald-400 to-teal-500",
              subtitle: `${progress?.arrayQuizzes || 0} quizzes`,
            },
            {
              label: "Stack Story Best",
              value: `${progress?.stackMissionScore || 0} pts`,
              accent: "from-orange-400 to-red-400",
              subtitle: `${progress?.stackMissions || 0} missions`,
            },
            {
              label: "Array Story Best",
              value: `${progress?.arrayMissionScore || 0} pts`,
              accent: "from-cyan-400 to-blue-500",
              subtitle: `${progress?.arrayMissions || 0} missions`,
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-3"
            >
              <div className={`inline-flex items-center justify-center rounded-lg px-2 py-1 text-[10px] font-semibold text-white bg-gradient-to-r ${card.accent}`}>
                {card.label}
              </div>
              <div className="text-2xl font-extrabold text-blue-950 mt-2">{card.value}</div>
              {card.subtitle && (
                <div className="text-[11px] text-gray-500 mt-1">{card.subtitle}</div>
              )}
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-blue-900 mb-3">
            <span className="font-semibold">Level {level} Progress</span>
            <span>{Math.round(xpProgress.current)} / {xpProgress.needed} XP</span>
          </div>
          <div className="w-full bg-white rounded-full h-4">
            <div
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 h-full rounded-full transition-all"
              style={{ width: `${xpProgress.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-900/70 mt-3">
            {xpProgress.percentage >= 100
              ? "Level up ready! Earn more XP to reach the next tier."
              : "Complete quizzes and streaks to boost your XP faster."}
          </p>
        </div>

        {/* Practice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              title: "Stack Practice",
              score: progress?.stackScore || 0,
              missionScore: progress?.stackMissionScore || 0,
              description: "Polish your LIFO fundamentals with timed drills.",
              accent: "from-sky-100 to-blue-100",
              textColor: "text-blue-900",
              buttonColor: "bg-blue-600 hover:bg-blue-700",
              route: "/stack",
            },
            {
              title: "Array Practice",
              score: progress?.arrayScore || 0,
              missionScore: progress?.arrayMissionScore || 0,
              description: "Master indexed access and tricky manipulations.",
              accent: "from-pink-100 to-rose-100",
              textColor: "text-rose-900",
              buttonColor: "bg-pink-600 hover:bg-pink-700",
              route: "/array",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`rounded-3xl border border-white shadow-lg bg-gradient-to-br ${card.accent} p-6 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xl font-bold ${card.textColor}`}>{card.title}</h3>
                <span className="text-sm font-semibold text-gray-500">Score</span>
              </div>
              <div className="text-4xl font-extrabold text-blue-950">{card.score}</div>
              <p className="text-xs text-gray-500 mt-1">Story best: {card.missionScore || 0} pts</p>
              <p className="text-sm text-gray-600 mt-3 flex-1">{card.description}</p>
              <button
                onClick={() => navigate(card.route)}
                className={`mt-4 self-start px-4 py-2 rounded-full text-white text-sm font-semibold transition ${card.buttonColor}`}
              >
                Practice →
              </button>
            </div>
          ))}
        </div>

        {/* Activity Snapshot */}
        {progress && (
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-blue-950">Activity Snapshot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
              <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">Stack Quizzes</p>
                <p className="text-2xl font-bold text-blue-900">{progress.stackQuizzes || 0}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">Array Quizzes</p>
                <p className="text-2xl font-bold text-pink-900">{progress.arrayQuizzes || 0}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">Stack Missions</p>
                <p className="text-2xl font-bold text-orange-900">{progress.stackMissions || 0}</p>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">Array Missions</p>
                <p className="text-2xl font-bold text-emerald-900">{progress.arrayMissions || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-blue-950 mb-4">Quick Launch</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Stack", icon: "📚", color: "bg-sky-100 text-blue-900", route: "/stack" },
              { label: "Array", icon: "📚", color: "bg-pink-100 text-rose-900", route: "/array" },
              { label: "Leaderboard", icon: "🏆", color: "bg-yellow-100 text-amber-900", route: "/leaderboard" },
              { label: "Help", icon: "❓", color: "bg-purple-100 text-purple-900", route: "/help" },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className={`${action.color} rounded-2xl py-4 font-semibold shadow-sm hover:shadow-md transition`}
              >
                <span className="block text-2xl">{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Streak */}
        {progress?.streak > 0 && (
          <div className="bg-orange-50 border border-orange-100 rounded-3xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-orange-700">{progress.streak} Day Streak!</div>
            <div className="text-sm text-orange-600">Keep the momentum going.</div>
          </div>
        )}
      </div>
    </div>
  );
}

