import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DIFFICULTY_EXP } from "@/app/api/user/route";

// GET /api/tasks?telegramId=xxx&status=all|active|completed
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegramId");
  const status = searchParams.get("status") || "all";

  if (!telegramId) {
    return NextResponse.json({ error: "telegramId is required" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { telegramId },
  });

  if (!user) {
    return NextResponse.json([]);
  }

  const where: Record<string, unknown> = { userId: user.id };
  if (status === "active") where.completed = false;
  if (status === "completed") where.completed = true;

  const tasks = await db.task.findMany({
    where,
    orderBy: [
      { completed: "asc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json(tasks);
}

// POST /api/tasks — Create a new task
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { telegramId, title, description, difficulty } = body;

  if (!telegramId || !title) {
    return NextResponse.json({ error: "telegramId and title are required" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { telegramId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const diff = difficulty || 1;
  const task = await db.task.create({
    data: {
      userId: user.id,
      title,
      description: description || null,
      difficulty: diff,
      expReward: DIFFICULTY_EXP[diff] || 10,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
