"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { useGamificationStore } from "@/store/gamification";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_EMOJI,
  DIFFICULTY_TEXT_COLOR,
  DIFFICULTY_EXP,
} from "@/lib/gamification";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  editTask?: {
    id: string;
    title: string;
    description: string | null;
    difficulty: number;
  } | null;
}

export function TaskModal({ open, onClose, editTask }: TaskModalProps) {
  const { addTask, updateTask, telegramId } = useGamificationStore();
  const [title, setTitle] = useState(editTask?.title || "");
  const [description, setDescription] = useState(editTask?.description || "");
  const [difficulty, setDifficulty] = useState(editTask?.difficulty || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or editTask changes
  useState(() => {
    if (open) {
      setTitle(editTask?.title || "");
      setDescription(editTask?.description || "");
      setDifficulty(editTask?.difficulty || 1);
    }
  });

  const handleSubmit = async () => {
    if (!title.trim() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (editTask) {
        // Update existing task
        const res = await fetch(`/api/tasks/${editTask.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            difficulty,
          }),
        });
        const data = await res.json();
        updateTask(editTask.id, data);
      } else {
        // Create new task
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telegramId,
            title: title.trim(),
            description: description.trim() || null,
            difficulty,
          }),
        });
        const data = await res.json();
        addTask(data);
      }

      setTitle("");
      setDescription("");
      setDifficulty(1);
      onClose();
    } catch (err) {
      console.error("Failed to save task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficulties = [1, 2, 3, 4] as const;

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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="max-w-lg mx-auto bg-[#1a1a2e]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 pb-2">
                <h2 className="text-lg font-bold text-white">
                  {editTask ? "✏️ Редактировать" : "✨ Новая задача"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-4 pt-2 space-y-4">
                {/* Title */}
                <div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Название задачи..."
                    maxLength={100}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm"
                    autoFocus
                  />
                  <div className="text-right mt-1">
                    <span className="text-[10px] text-white/20">{title.length}/100</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Описание (необязательно)..."
                    maxLength={500}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all text-sm resize-none"
                  />
                </div>

                {/* Difficulty selector */}
                <div>
                  <label className="text-xs font-medium text-white/40 mb-2 block">
                    Сложность
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {difficulties.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={cn(
                          "relative flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border transition-all duration-200",
                          difficulty === d
                            ? `bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border-violet-500/40 ${DIFFICULTY_TEXT_COLOR[d]}`
                            : "bg-white/[0.03] border-white/[0.06] text-white/40 hover:border-white/15"
                        )}
                      >
                        <span className="text-lg">{DIFFICULTY_EMOJI[d]}</span>
                        <span className="text-[10px] font-medium">{DIFFICULTY_LABELS[d]}</span>
                        <span className="flex items-center gap-0.5 text-[9px]">
                          <Zap className="w-2.5 h-2.5 text-yellow-500" />
                          {DIFFICULTY_EXP[d]}
                        </span>

                        {/* Selected indicator */}
                        {difficulty === d && (
                          <motion.div
                            layoutId="difficulty-indicator"
                            className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-violet-500 rounded-full"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={!title.trim() || isSubmitting}
                  className={cn(
                    "w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                    title.trim()
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/25"
                      : "bg-white/5 text-white/20 cursor-not-allowed"
                  )}
                >
                  {editTask ? "Сохранить изменения" : "Создать задачу"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
