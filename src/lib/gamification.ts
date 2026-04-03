export const DIFFICULTY_EXP: Record<number, number> = {
  1: 10,
  2: 25,
  3: 50,
  4: 100,
};

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Лёгкая",
  2: "Средняя",
  3: "Сложная",
  4: "Эпическая",
};

export const DIFFICULTY_EMOJI: Record<number, string> = {
  1: "🟢",
  2: "🟡",
  3: "🟠",
  4: "🔴",
};

export const DIFFICULTY_GRADIENT: Record<number, string> = {
  1: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  2: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  3: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  4: "from-rose-500/20 to-rose-600/10 border-rose-500/30",
};

export const DIFFICULTY_TEXT_COLOR: Record<number, string> = {
  1: "text-emerald-400",
  2: "text-amber-400",
  3: "text-orange-400",
  4: "text-rose-400",
};

export const DIFFICULTY_BG_COLOR: Record<number, string> = {
  1: "bg-emerald-500/15",
  2: "bg-amber-500/15",
  3: "bg-orange-500/15",
  4: "bg-rose-500/15",
};

export function getExpForCurrentLevel(level: number): number {
  return 100 + (level - 1) * 10;
}
