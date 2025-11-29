import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const activityId = parseInt(id);

    if (isNaN(activityId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        goals: true,
        interests: true,
        participants: {
            where: { userId: session.user.id }
        }
      },
    });

    if (!activity) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    }

    // Check if user is a participant
    if (activity.participants.length === 0) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const activityId = parseInt(id);

    if (isNaN(activityId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, goals } = body;

    // Verify ownership
    const participant = await prisma.activityParticipant.findUnique({
        where: {
            userId_activityId: {
                userId: session.user.id,
                activityId: activityId
            }
        }
    });

    if (!participant || participant.role !== 'OWNER') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedActivity = await prisma.$transaction(async (tx) => {
        // Update activity details
        const activity = await tx.activity.update({
            where: { id: activityId },
            data: {
                name,
                description,
            }
        });

        // Handle goals
        if (goals && Array.isArray(goals)) {
            // Get existing goals
            const existingGoals = await tx.goal.findMany({
                where: { activityId: activityId },
                select: { id: true }
            });
            const existingGoalIds = existingGoals.map(g => g.id);

            const incomingGoalIds = goals
                .filter((g: any) => g.id)
                .map((g: any) => g.id);

            // Delete goals that are not in the incoming list
            const goalsToDelete = existingGoalIds.filter(id => !incomingGoalIds.includes(id));
            if (goalsToDelete.length > 0) {
                await tx.goal.deleteMany({
                    where: { id: { in: goalsToDelete } }
                });
            }

            // Upsert goals
            for (const goal of goals) {
                if (goal.id) {
                    await tx.goal.update({
                        where: { id: goal.id },
                        data: {
                            title: goal.title,
                            description: goal.description,
                            startDate: new Date(goal.startDate),
                            endDate: new Date(goal.endDate),
                        }
                    });
                } else {
                    await tx.goal.create({
                        data: {
                            activityId: activityId,
                            title: goal.title,
                            description: goal.description,
                            startDate: new Date(goal.startDate),
                            endDate: new Date(goal.endDate),
                        }
                    });
                }
            }
        }

        return activity;
    });

    return NextResponse.json(updatedActivity);

  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
  
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { id } = await params;
      const activityId = parseInt(id);
  
      if (isNaN(activityId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
  
      // Verify ownership
      const participant = await prisma.activityParticipant.findUnique({
          where: {
              userId_activityId: {
                  userId: session.user.id,
                  activityId: activityId
              }
          }
      });
  
      if (!participant || participant.role !== 'OWNER') {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
  
      await prisma.activity.delete({
          where: { id: activityId }
      });
  
      return NextResponse.json({ success: true });
  
    } catch (error) {
      console.error("Error deleting activity:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
