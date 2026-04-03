"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ListChecks, BarChart3 } from "lucide-react";
import { useGamificationStore, Task } from "@/store/gamification";
import { useTelegram } from "@/hooks/use-telegram";
import { LevelBar } from "@/components/task-manager/level-bar";
import { TaskCard } from "@/components/task-manager/task-card";
import { TaskModal } from "@/components/task-manager/task-modal";
import { LevelUpNotification } from "@/components/task-manager/level-up-notification";
import { FilterTabs } from "@/components/task-manager/filter-tabs";
import { EmptyState } from "@/components/task-manager/empty-state";
import { StatsPanel } from "@/components/task-manager/stats-panel";

export default function HomePage() {
  const { telegramId, isReady } = useTelegram();
  const store = useGamificationStore();
  const {
    user,
    tasks,
    filter,
    loading,
    levelUpData,
    setUser,
    setTasks,
    removeTask,
    setLoading,
    setLevelUpData,
    setTelegramId,
  } = store;

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [statsOpen, setStatsOpen] = useState(false);

  // Sync telegramId to store
  useEffect(() => {
    if (telegramId) {
      setTelegramId(telegramId);
    }
  }, [telegramId, setTelegramId]);

  const fetchData = useCallback(async () => {
    if (!telegramId) return;
    try {
      setLoading(true);
      const [userRes, tasksRes] = await Promise.all([
        fetch(`/api/user?telegramId=${telegramId}`),
        fetch(`/api/tasks?telegramId=${telegramId}&status=all`),
      ]);
      const userData = await userRes.json();
      const tasksData = await tasksRes.json();
      setUser(userData);
      setTasks(tasksData);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, [telegramId, setUser, setTasks, setLoading]);

  useEffect(() => {
    if (isReady && telegramId) {
      fetchData();
    }
  }, [isReady, telegramId, fetchData]);

  const handleEdit = (task: Task) => {
    setEditTask(task);
  };

  const handleDelete = (task: Task) => {
    removeTask(task.id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTask(null);
    fetchData();
  };

  const handleCloseEdit = () => {
    setEditTask(null);
    fetchData();
  };

  // Level up notification
  const showLevelUp = levelUpData?.leveledUp && levelUpData.newLevel > 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  // Stats
  const totalExpEarned = user?.exp || 0;
  const totalTasksCompleted = tasks.filter((t) => t.completed).length;

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <ListChecks className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-white/40">Загрузка...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Status bar spacer */}
      <div className="h-[env(safe-area-inset-top)]" />

      <div className="max-w-lg mx-auto px-4 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 pb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <ListChecks className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  QuestBoard
                </h1>
                <p className="text-[11px] text-white/30 -mt-0.5">
                  Геймифицированный таск-менеджер
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatsOpen(true)}
                className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.header>

        {/* Level Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5"
        >
          <LevelBar />
        </motion.div>

        {/* Stats cards row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-2 mb-5"
        >
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-violet-400">{counts.active}</div>
            <div className="text-[10px] text-white/30 mt-0.5">Активных</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-emerald-400">{totalTasksCompleted}</div>
            <div className="text-[10px] text-white/30 mt-0.5">Выполнено</div>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-yellow-400">{totalExpEarned}</div>
            <div className="text-[10px] text-white/30 mt-0.5">Всего EXP</div>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <FilterTabs counts={counts} />
        </motion.div>

        {/* Task list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* FAB — Create Task */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setEditTask(null);
          setModalOpen(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-2xl shadow-violet-500/30 flex items-center justify-center z-30 hover:shadow-violet-500/50 transition-shadow [bottom:calc(1.5rem+env(safe-area-inset-bottom))]"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Task Modal (Create) */}
      <TaskModal open={modalOpen} onClose={handleCloseModal} />

      {/* Task Modal (Edit) */}
      <TaskModal
        open={!!editTask}
        onClose={handleCloseEdit}
        editTask={
          editTask
            ? {
                id: editTask.id,
                title: editTask.title,
                description: editTask.description,
                difficulty: editTask.difficulty,
              }
            : null
        }
      />

      {/* Level Up Notification */}
      <LevelUpNotification
        show={!!showLevelUp}
        level={levelUpData?.newLevel || 1}
        onClose={() => setLevelUpData(null)}
      />

      {/* Stats Panel */}
      <StatsPanel
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        totalExp={totalExpEarned}
        totalCompleted={totalTasksCompleted}
        tasks={tasks}
      />
    </div>
  );
}
