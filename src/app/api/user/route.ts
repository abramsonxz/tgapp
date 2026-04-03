import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// EXP required for each level: Level N requires (100 + (N-1) * 10) EXP to level up
export function getExpForCurrentLevel(level: number): number {
  return 100 + (level - 1) * 10;
}

export function calculateLevel(totalExp: number): number {
  let level = 1;
  let cumulative = 0;
  while (cumulative + getExpForCurrentLevel(level) <= totalExp) {
    cumulative += getExpForCurrentLevel(level);
    level++;
  }
  return level;
}

export function getExpProgress(totalExp: number): {
  level: number;
  currentLevelExp: number;
  expInLevel: number;
  percentage: number;
} {
  const level = calculateLevel(totalExp);
  let cumulative = 0;
  for (let i = 1; i < level; i++) {
    cumulative += getExpForCurrentLevel(i);
  }
  const currentLevelExp = totalExp - cumulative;
  const expInLevel = getExpForCurrentLevel(level);
  const percentage = Math.min((currentLevelExp / expInLevel) * 100, 100);
  return { level, currentLevelExp, expInLevel, percentage };
}

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

export const DIFFICULTY_COLORS: Record<number, string> = {
  1: "emerald",
  2: "amber",
  3: "orange",
  4: "rose",
};

// GET /api/user?telegramId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");

  if (!telegramId) {
    return NextResponse.json({ error: "telegramId is required" }, { status: 400 });
  }

  let user = await db.user.findUnique({
    where: { telegramId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        telegramId,
        firstName: "Пользователь",
        exp: 0,
        level: 1,
      },
    });
  }

  const progress = getExpProgress(user.exp);

  return NextResponse.json({
    ...user,
    ...progress,
  });
}
