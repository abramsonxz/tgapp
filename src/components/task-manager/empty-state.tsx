"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-white/15" />
      </div>
      <h3 className="text-sm font-semibold text-white/30 mb-1">Задач пока нет</h3>
      <p className="text-xs text-white/15 max-w-[200px]">
        Нажмите + чтобы создать свою первую задачу и начать зарабатывать EXP
      </p>
    </motion.div>
  );
}
