import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Prisma } from "@prisma/client";

// GET: Pobierz cele (wymagane activityId lub pobranie celów ze wszystkich aktywności użytkownika)
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get("activityId");

    const whereClause: Prisma.GoalWhereInput = {
      isActive: true,
    };

    if (activityId) {
      // Sprawdź czy user ma dostęp do aktywności
      const participant = await prisma.activityParticipant.findUnique({
        where: {
          userId_activityId: {
            userId: session.user.id,
            activityId: parseInt(activityId),
          },
        },
      });

      if (!participant) {
         return NextResponse.json({ error: "Access denied to this activity" }, { status: 403 });
      }

      whereClause.activityId = parseInt(activityId);
    } else {
      // Jeśli nie podano activityId, pobierz cele ze wszystkich aktywności użytkownika
      whereClause.activity = {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      };
    }

    const goals = await prisma.goal.findMany({
      where: whereClause,
      include: {
        progress: {
            where: {
                userId: session.user.id
            }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Utwórz nowy cel w ramach aktywności
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, startDate, endDate, categoryId, activityId } = body;

    if (!title || !startDate || !endDate || !activityId) {
      return NextResponse.json({ error: "Missing required fields (including activityId)" }, { status: 400 });
    }

    // Sprawdź uprawnienia (czy user jest uczestnikiem aktywności)
    // Można dodać wymóg bycia OWNER lub ADMIN, tutaj zakładamy dowolnego uczestnika dla uproszczenia lub OWNER
    const participant = await prisma.activityParticipant.findUnique({
        where: {
            userId_activityId: {
                userId: session.user.id,
                activityId: parseInt(activityId)
            }
        }
    });

    if (!participant) {
        return NextResponse.json({ error: "Access denied to this activity" }, { status: 403 });
    }

    const goal = await prisma.goal.create({
      data: {
        activityId: parseInt(activityId),
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}