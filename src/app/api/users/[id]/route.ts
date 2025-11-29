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

    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        interests: true,
        activities: {
            include: {
                activity: {
                    include: {
                        goals: {
                            where: { isActive: true },
                            include: {
                                progress: {
                                    where: { userId: id }
                                }
                            }
                        }
                    }
                }
            }
        },
        proofs: {
            orderBy: { createdAt: 'desc' },
            take: 1
        },
        progress: {
            include: {
                goal: true
            }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalGoals = user.activities.reduce((acc, curr) => acc + curr.activity.goals.length, 0);
    
    const completedGoals = user.progress.filter((p) => p.isCompleted).length;
    
    const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    // Calculate streak
    let streak = 0;
    const completedGoalDates = user.progress
      .filter((p) => p.isCompleted && p.completedAt)
      .map((p) => new Date(p.completedAt!).setHours(0, 0, 0, 0))
      .sort((a, b) => b - a);

    const uniqueDates = [...new Set(completedGoalDates)];

    if (uniqueDates.length > 0) {
        const today = new Date().setHours(0,0,0,0);
        const yesterday = new Date(today - 86400000).setHours(0,0,0,0);
        
        if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
            streak = 1;
            let currentDate = uniqueDates[0];
            for (let i = 1; i < uniqueDates.length; i++) {
                const prevDate = uniqueDates[i];
                const diff = (currentDate - prevDate) / (1000 * 60 * 60 * 24);
                if (diff === 1) {
                    streak++;
                    currentDate = prevDate;
                } else {
                    break;
                }
            }
        }
    }

    // Collect active goals
    const activeGoals = user.activities.flatMap(a => a.activity.goals);

    // Last activity
    let lastActivity = user.updatedAt;
    // Check last proof
    if (user.proofs.length > 0) {
        const lastProofTime = user.proofs[0].createdAt;
        if (lastProofTime > lastActivity) lastActivity = lastProofTime;
    }
    // Check last completed goal
    const lastCompleted = user.progress
        .filter(p => p.isCompleted && p.completedAt)
        .sort((a,b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0];
        
    if (lastCompleted && lastCompleted.completedAt && lastCompleted.completedAt > lastActivity) {
        lastActivity = lastCompleted.completedAt;
    }

    const response = {
      nick: user.name,
      email: user.email,
      image: user.image,
      streak: streak,
      stats: {
        totalTasks: totalGoals,
        completedTasks: completedGoals,
        progress: Math.round(progressPercentage),
      },
      activeGoals: activeGoals,
      activeGoalsCount: activeGoals.length,
      lastCompletedGoal: lastCompleted ? lastCompleted.goal : null,
      registrationDate: user.createdAt,
      lastActivity: lastActivity,
      interests: user.interests.map((i) => i.name),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
