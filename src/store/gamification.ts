import { create } from "zustand";

export interface UserData {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  exp: number;
  level: number;
  currentLevelExp: number;
  expInLevel: number;
  percentage: number;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  difficulty: number;
  expReward: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GamificationStore {
  telegramId: string;
  user: UserData | null;
  tasks: Task[];
  filter: "all" | "active" | "completed";
  loading: boolean;
  completingTaskId: string | null;
  levelUpData: { leveledUp: boolean; newLevel: number } | null;

  setTelegramId: (id: string) => void;
  setFilter: (filter: "all" | "active" | "completed") => void;
  setUser: (user: UserData) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;
  toggleComplete: (id: string, expChange: number, data?: { leveledUp: boolean; newLevel: number }) => void;
  setLoading: (loading: boolean) => void;
  setCompletingTaskId: (id: string | null) => void;
  setLevelUpData: (data: { leveledUp: boolean; newLevel: number } | null) => void;
}

export const useGamificationStore = create<GamificationStore>((set) => ({
  telegramId: "demo_user",
  user: null,
  tasks: [],
  filter: "all",
  loading: true,
  completingTaskId: null,
  levelUpData: null,

  setTelegramId: (id) => set({ telegramId: id }),
  setFilter: (filter) => set({ filter }),
  setUser: (user) => set({ user }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  removeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  toggleComplete: (id, expChange, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : null,
            }
          : t
      ),
      user: state.user
        ? {
            ...state.user,
            exp: state.user.exp + expChange,
            level: data?.newLevel ?? state.user.level,
          }
        : null,
      levelUpData: data ?? null,
    })),
  setLoading: (loading) => set({ loading }),
  setCompletingTaskId: (id) => set({ completingTaskId: id }),
  setLevelUpData: (data) => set({ levelUpData: data }),
}));
