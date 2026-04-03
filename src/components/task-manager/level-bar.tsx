"use client";

import { motion } from "framer-motion";
import { useGamificationStore } from "@/store/gamification";
import { getExpForCurrentLevel } from "@/lib/gamification";
import { Trophy, Zap, Star, Flame } from "lucide-react";

export function LevelBar() {
  const { user } = useGamificationStore();

  if (!user) return null;

  const expNeeded = getExpForCurrentLevel(user.level);

  const getLevelTitle = (level: number): { title: string; icon: React.ReactNode } => {
    if (level >= 20) return { title: "Легенда", icon: <Flame className="w-4 h-4" /> };
    if (level >= 15) return { title: "Мастер", icon: <Star className="w-4 h-4" /> };
    if (level >= 10) return { title: "Ветеран", icon: <Trophy className="w-4 h-4" /> };
    if (level >= 5) return { title: "Боец", icon: <Zap className="w-4 h-4" /> };
    return { title: "Новичок", icon: <Zap className="w-4 h-4" /> };
  };

  const { title, icon } = getLevelTitle(user.level);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-950/80 via-purple-900/60 to-fuchsia-900/40 border border-violet-500/20 p-4 backdrop-blur-sm"
    >
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl" />

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/25">
              <span className="text-lg font-black text-white">{user.level}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-violet-200">Уровень {user.level}</span>
                <span className="text-xs text-violet-400/80 flex items-center gap-0.5">
                  {icon} {title}
                </span>
              </div>
              <span className="text-xs text-violet-400/60">
                {user.currentLevelExp} / {expNeeded} EXP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/20">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-400">{user.exp}</span>
            <span className="text-xs text-violet-400">EXP</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2.5 bg-violet-950/60 rounded-full overflow-hidden border border-violet-500/10">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"
            initial={{ width: 0 }}
            animate={{ width: `${user.percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: [-100, 400] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
            style={{ width: "30%" }}
          />
        </div>

        {/* Next level hint */}
        <div className="mt-1.5 text-right">
          <span className="text-[10px] text-violet-500/60">
            До уровня {user.level + 1}: ещё {expNeeded - user.currentLevelExp} EXP
          </span>
        </div>
      </div>
    </motion.div>
  );
}
