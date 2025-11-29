import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Pobierz aktywności użytkownika
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session.user.id;

    const activities = await prisma.activity.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        },
        goals: {
            include: {
                progress: {
                    where: { userId: userId }
                }
            }
        }, // Dołącz cele aktywności z progresem użytkownika
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Utwórz nową aktywność
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, interestIds, goals } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const activity = await prisma.$transaction(async (tx) => {
      const newActivity = await tx.activity.create({
        data: {
          name,
          description,
          interests: interestIds && Array.isArray(interestIds) ? {
            connect: interestIds.map((id: number) => ({ id }))
          } : undefined
        },
      });

      if (goals && Array.isArray(goals)) {
        await tx.goal.createMany({
          data: goals.map((goal: any) => ({
            activityId: newActivity.id,
            title: goal.title,
            description: goal.description,
            startDate: new Date(goal.startDate),
            endDate: new Date(goal.endDate),
          })),
        });
      }

      await tx.activityParticipant.create({
        data: {
          userId: session.user.id,
          activityId: newActivity.id,
          role: "OWNER",
        },
      });

      return newActivity;
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}