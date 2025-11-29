import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Pobierz zadania (opcjonalnie filtruj po goalId)
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get("goalId");

    const whereClause: any = { userId: session.user.id };
    if (goalId) {
      whereClause.goalId = parseInt(goalId);
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Utwórz zadanie
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { goalId, dueDate, status } = body;

    if (!goalId || !dueDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Sprawdź, czy cel należy do użytkownika
    const goal = await prisma.goal.findUnique({
      where: { id: parseInt(goalId) },
    });

    if (!goal || goal.userId !== session.user.id) {
        return NextResponse.json({ error: "Goal not found or access denied" }, { status: 403 });
    }

    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        goalId: parseInt(goalId),
        dueDate: new Date(dueDate),
        status: status || "PENDING",
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
