"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Zap, Trophy, TrendingUp, Flame, BarChart3 } from "lucide-react";
import { Task } from "@/store/gamification";
import { DIFFICULTY_LABELS, DIFFICULTY_TEXT_COLOR } from "@/lib/gamification";
import { cn } from "@/lib/utils";

interface StatsPanelProps {
  open: boolean;
  onClose: () => void;
  totalExp: number;
  totalCompleted: number;
  tasks: Task[];
}

export function StatsPanel({ open, onClose, totalExp, totalCompleted, tasks }: StatsPanelProps) {
  const completedTasks = tasks.filter((t) => t.completed);

  // Calculate difficulty distribution
  const difficultyStats = [1, 2, 3, 4].map((d) => ({
    difficulty: d,
    label: DIFFICULTY_LABELS[d],
    total: tasks.filter((t) => t.difficulty === d).length,
    completed: completedTasks.filter((t) => t.difficulty === d).length,
    color: DIFFICULTY_TEXT_COLOR[d],
  }));

  // Calculate completion rate
  const completionRate = tasks.length > 0 ? Math.round((totalCompleted / tasks.length) * 100) : 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="max-w-lg mx-auto bg-[#1a1a2e]/95 backdrop-blur-xl rounded-t-3xl border-t border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/15" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                  Статистика
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 pb-8 space-y-5">
                {/* Main stats */}
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    icon={<Zap className="w-4 h-4 text-yellow-400" />}
                    label="Всего EXP"
                    value={totalExp.toString()}
                    bg="from-yellow-500/10 to-amber-500/5"
                    border="border-yellow-500/20"
                  />
                  <StatCard
                    icon={<Target className="w-4 h-4 text-emerald-400" />}
                    label="Выполнено"
                    value={`${totalCompleted}`}
                    bg="from-emerald-500/10 to-cyan-500/5"
                    border="border-emerald-500/20"
                  />
                  <StatCard
                    icon={<TrendingUp className="w-4 h-4 text-violet-400" />}
                    label="Продуктивность"
                    value={`${completionRate}%`}
                    bg="from-violet-500/10 to-fuchsia-500/5"
                    border="border-violet-500/20"
                  />
                  <StatCard
                    icon={<Flame className="w-4 h-4 text-orange-400" />}
                    label="Активных"
                    value={`${tasks.length - totalCompleted}`}
                    bg="from-orange-500/10 to-red-500/5"
                    border="border-orange-500/20"
                  />
                </div>

                {/* Difficulty breakdown */}
                <div>
                  <h3 className="text-xs font-semibold text-white/40 mb-3 uppercase tracking-wider">
                    По сложности
                  </h3>
                  <div className="space-y-2">
                    {difficultyStats.map((d) => (
                      <div
                        key={d.difficulty}
                        className="flex items-center gap-3 bg-white/[0.02] rounded-xl p-3 border border-white/[0.05]"
                      >
                        <span className={cn("text-sm font-semibold w-20", d.color)}>
                          {d.label}
                        </span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                            style={{
                              width: d.total > 0 ? `${(d.completed / d.total) * 100}%` : "0%",
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/30 w-16 text-right">
                          {d.completed}/{d.total}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
  border,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={cn("rounded-xl p-3.5 bg-gradient-to-br border", bg, border)}>
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-[10px] text-white/40">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}


