"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGamificationStore, Task } from "@/store/gamification";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_GRADIENT,
  DIFFICULTY_TEXT_COLOR,
  DIFFICULTY_EMOJI,
} from "@/lib/gamification";
import { Check, Trash2, Pencil, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { toggleComplete, completingTaskId, telegramId } = useGamificationStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const isCompleting = completingTaskId === task.id;

  const handleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/tasks/${task.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId }),
      });
      const data = await res.json();
      toggleComplete(task.id, data.expChange, {
        leveledUp: data.leveledUp,
        newLevel: data.newLevel,
      });

      // Re-fetch user
      const userRes = await fetch(`/api/user?telegramId=${telegramId}`);
      const userData = await userRes.json();
      useGamificationStore.getState().setUser(userData);
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      onDelete(task);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: isDeleting ? 0 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-300",
        task.completed
          ? "bg-white/[0.03] border-white/[0.06] opacity-60"
          : `bg-gradient-to-br ${DIFFICULTY_GRADIENT[task.difficulty]}`
      )}
    >
      {/* Completed overlay stripe */}
      {task.completed && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 origin-left"
        />
      )}

      <div className="flex items-start gap-3 p-3.5">
        {/* Complete button */}
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          className={cn(
            "mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
            task.completed
              ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/25"
              : "border-white/20 hover:border-violet-400 hover:bg-violet-500/10"
          )}
        >
          {isCompleting ? (
            <Loader2 className="w-3 h-3 text-white animate-spin" />
          ) : task.completed ? (
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          ) : null}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3
              className={cn(
                "text-sm font-semibold leading-tight",
                task.completed
                  ? "text-white/40 line-through"
                  : "text-white/90"
              )}
            >
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p
              className={cn(
                "text-xs mt-1 leading-relaxed",
                task.completed ? "text-white/20 line-through" : "text-white/50"
              )}
            >
              {task.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium",
                task.completed ? "bg-white/5 text-white/30" : `bg-white/5 ${DIFFICULTY_TEXT_COLOR[task.difficulty]}`
              )}
            >
              <span>{DIFFICULTY_EMOJI[task.difficulty]}</span>
              {DIFFICULTY_LABELS[task.difficulty]}
            </span>

            {!task.completed && (
              <span className="inline-flex items-center gap-1 text-[10px] text-violet-400/70">
                <Zap className="w-3 h-3 text-yellow-500" />
                +{task.expReward} EXP
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        {!task.completed && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-violet-400 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg hover:bg-rose-500/10 text-white/30 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Swipe delete hint on mobile - always visible delete */}
        {task.completed && (
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-white/20 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
