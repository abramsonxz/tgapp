import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateLevel, DIFFICULTY_EXP } from "@/app/api/user/route";

// POST /api/tasks/[id]/complete — Toggle task completion and award EXP
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { telegramId } = body;

  if (!telegramId) {
    return NextResponse.json({ error: "telegramId is required" }, { status: 400 });
  }

  const task = await db.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const user = await db.user.findUnique({
    where: { telegramId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (task.completed) {
    // Uncomplete — remove EXP
    const newExp = Math.max(0, user.exp - task.expReward);
    const newLevel = calculateLevel(newExp);

    const [updatedTask, updatedUser] = await db.$transaction([
      db.task.update({
        where: { id },
        data: { completed: false, completedAt: null },
      }),
      db.user.update({
        where: { telegramId },
        data: { exp: newExp, level: newLevel },
      }),
    ]);

    return NextResponse.json({ task: updatedTask, user: updatedUser, expChange: -task.expReward });
  } else {
    // Complete — award EXP
    const newExp = user.exp + task.expReward;
    const newLevel = calculateLevel(newExp);
    const leveledUp = newLevel > user.level;

    const [updatedTask, updatedUser] = await db.$transaction([
      db.task.update({
        where: { id },
        data: { completed: true, completedAt: new Date() },
      }),
      db.user.update({
        where: { telegramId },
        data: { exp: newExp, level: newLevel },
      }),
    ]);

    return NextResponse.json({
      task: updatedTask,
      user: updatedUser,
      expChange: task.expReward,
      leveledUp,
      newLevel,
    });
  }
}
