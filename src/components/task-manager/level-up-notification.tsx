"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star, Trophy } from "lucide-react";

interface LevelUpNotificationProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpNotification({ show, level, onClose }: LevelUpNotificationProps) {
  if (!show) return null;

  const getTitle = (lvl: number) => {
    if (lvl >= 20) return "Легенда";
    if (lvl >= 15) return "Мастер";
    if (lvl >= 10) return "Ветеран";
    if (lvl >= 5) return "Боец";
    return "Новичок";
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -30 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              onClick={onClose}
              className="relative z-10 pointer-events-auto cursor-pointer"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl blur-2xl opacity-40 scale-110" />

              <div className="relative bg-[#1a1a2e]/95 backdrop-blur-xl rounded-3xl border border-violet-500/30 p-8 text-center min-w-[280px]">
                {/* Trophy icon */}
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 10 }}
                  className="mx-auto mb-4"
                >
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-2xl shadow-violet-500/50">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2"
                >
                  LEVEL UP!
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-5xl font-black text-white mb-1">{level}</div>
                  <div className="text-sm font-medium text-violet-300/80 mb-3">
                    {getTitle(level)}
                  </div>
                </motion.div>

                {/* Stars animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center gap-1 mb-4"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-white/40"
                >
                  Нажмите, чтобы закрыть
                </motion.p>
              </div>

              {/* Confetti-like particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    x: (Math.random() - 0.5) * 200,
                    y: (Math.random() - 0.5) * 200,
                  }}
                  transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: [
                      "rgb(167, 139, 250)",
                      "rgb(244, 114, 182)",
                      "rgb(250, 204, 21)",
                      "rgb(52, 211, 153)",
                    ][i % 4],
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
