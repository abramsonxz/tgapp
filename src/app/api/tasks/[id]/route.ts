import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DIFFICULTY_EXP } from "@/app/api/user/route";

// PUT /api/tasks/[id] — Update a task
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { title, description, difficulty } = body;

  const task = await db.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const updatedTask = await db.task.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(difficulty !== undefined && {
        difficulty,
        expReward: DIFFICULTY_EXP[difficulty] || 10,
      }),
    },
  });

  return NextResponse.json(updatedTask);
}

// DELETE /api/tasks/[id] — Delete a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const task = await db.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  await db.task.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
