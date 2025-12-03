import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Gamification() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    points: 0,
    level: 1,
    streak: 0,
    testsCompleted: 0,
    achievements: []
  });

  useEffect(() => {
    // Load user stats from localStorage
    const savedStats = localStorage.getItem(`gamification_${user?.id || 'guest'}`);
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      // Initialize with default stats
      const defaultStats = {
        points: 0,
        level: 1,
        streak: 0,
        testsCompleted: 0,
        achievements: []
      };
      setStats(defaultStats);
      localStorage.setItem(`gamification_${user?.id || 'guest'}`, JSON.stringify(defaultStats));
    }
  }, [user]);

  // Calculate level based on points
  const calculateLevel = (points) => {
    return Math.floor(points / 100) + 1;
  };

  // Calculate progress to next level
  const progressToNextLevel = (points) => {
    const currentLevelPoints = (calculateLevel(points) - 1) * 100;
    const nextLevelPoints = calculateLevel(points) * 100;
    const progress = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Available achievements
  const availableAchievements = [
    { id: "first_test", name: "First Steps", desc: "Complete your first test", icon: "🎯", points: 50, unlocked: stats.achievements.includes("first_test") },
    { id: "streak_3", name: "On Fire", desc: "3 day streak", icon: "🔥", points: 30, unlocked: stats.achievements.includes("streak_3") },
    { id: "streak_7", name: "Week Warrior", desc: "7 day streak", icon: "💪", points: 100, unlocked: stats.achievements.includes("streak_7") },
    { id: "perfect_score", name: "Perfect Score", desc: "Get 100% on a test", icon: "⭐", points: 200, unlocked: stats.achievements.includes("perfect_score") },
    { id: "speed_demon", name: "Speed Demon", desc: "Complete test in half time", icon: "⚡", points: 150, unlocked: stats.achievements.includes("speed_demon") },
    { id: "premium_member", name: "Premium Member", desc: "Purchase a premium test", icon: "👑", points: 250, unlocked: stats.achievements.includes("premium_member") },
    { id: "practice_master", name: "Practice Master", desc: "Complete 10 practice sessions", icon: "📚", points: 300, unlocked: stats.achievements.includes("practice_master") },
    { id: "interview_ready", name: "Interview Ready", desc: "Complete all interview categories", icon: "🎤", points: 400, unlocked: stats.achievements.includes("interview_ready") }
  ];

  const currentLevel = calculateLevel(stats.points);
  const progress = progressToNextLevel(stats.points);
  const pointsForNextLevel = currentLevel * 100;
  const pointsNeeded = pointsForNextLevel - stats.points;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>🏆</span> Your Progress
            </h2>
            <p className="text-white/80 text-sm mt-1">Level {currentLevel} • {stats.points} Points</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.streak}</div>
            <div className="text-sm text-white/80">Day Streak 🔥</div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-2">
            <span>Level {currentLevel}</span>
            <span>{pointsNeeded} points to Level {currentLevel + 1}</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600">{stats.testsCompleted}</div>
            <div className="text-xs text-slate-600 mt-1">Tests Done</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600">{stats.points}</div>
            <div className="text-xs text-slate-600 mt-1">Total Points</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
            <div className="text-3xl font-bold text-orange-600">{stats.achievements.length}</div>
            <div className="text-xs text-slate-600 mt-1">Achievements</div>
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>🎖️</span> Achievements
            <span className="text-sm font-normal text-slate-500">
              ({stats.achievements.length}/{availableAchievements.length})
            </span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {availableAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-800">{achievement.name}</div>
                    <div className="text-xs text-slate-600 mt-0.5">{achievement.desc}</div>
                    <div className="text-xs text-purple-600 font-medium mt-1">
                      +{achievement.points} pts
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-green-800 flex items-center gap-2">
                <span>⚡</span> Daily Challenge
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Complete a test today to earn 50 bonus points!
              </p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              Start
            </button>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl">
          <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span>📊</span> Your Ranking
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">#{Math.floor(Math.random() * 100) + 1}</div>
              <div className="text-xs text-slate-600">Global Leaderboard</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-slate-800">Top 10%</div>
              <div className="text-xs text-slate-500">Keep going! 🚀</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

