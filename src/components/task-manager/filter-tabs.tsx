"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGamificationStore } from "@/store/gamification";
import { cn } from "@/lib/utils";
import { ListTodo, CheckCircle2, ClipboardList } from "lucide-react";

interface FilterTabsProps {
  counts: { all: number; active: number; completed: number };
}

const tabs = [
  { key: "all" as const, label: "Все", icon: ClipboardList },
  { key: "active" as const, label: "Активные", icon: ListTodo },
  { key: "completed" as const, label: "Готовые", icon: CheckCircle2 },
];

export function FilterTabs({ counts }: FilterTabsProps) {
  const { filter, setFilter } = useGamificationStore();

  return (
    <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setFilter(tab.key)}
          className={cn(
            "relative flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200",
            filter === tab.key
              ? "text-white"
              : "text-white/35 hover:text-white/50"
          )}
        >
          {filter === tab.key && (
            <motion.div
              layoutId="filter-bg"
              className="absolute inset-0 bg-white/[0.08] rounded-lg border border-white/[0.06]"
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-md",
                filter === tab.key
                  ? "bg-violet-500/20 text-violet-300"
                  : "bg-white/5 text-white/25"
              )}
            >
              {counts[tab.key]}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
