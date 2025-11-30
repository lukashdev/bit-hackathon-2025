import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        interests: true,
        // Removed tasks relation
        activities: {
            include: {
                activity: {
                    include: {
                        goals: {
                            where: { isActive: true },
                            include: {
                                progress: {
                                    where: { userId: session.user.id }
                                }
                            }
                        }
                    }
                }
            }
        },
        proofs: { // Renamed from taskProofs
            orderBy: { createdAt: 'desc' },
            take: 1
        },
        progress: {
            include: {
                goal: true
            }
        } // To calculate completed goals
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate stats based on GOALS now, not tasks
    // We can look at 'progress' table for the user
    const totalGoals = user.activities.reduce((acc, curr) => acc + curr.activity.goals.length, 0);
    // Or better, distinct goals user has interacted with?
    // Let's say total goals available to user = goals in their activities
    
    const completedGoals = user.progress.filter((p) => p.isCompleted).length;
    // Note: totalGoals might be larger than progress entries if user hasn't started them.
    
    const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    // Calculate streak
    // Based on completedAt in progress
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

    // Calculate total likes received
    const likesReceived = await prisma.like.count({
        where: {
            proof: {
                userId: session.user.id
            }
        }
    });

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
      id: user.id,
      nick: user.name,
      email: user.email,
      image: user.image,
      streak: streak,
      stats: {
        totalTasks: totalGoals, // Renaming to generic 'tasks' for frontend compatibility or 'totalGoals'
        completedTasks: completedGoals,
        progress: Math.round(progressPercentage),
        likesReceived: likesReceived,
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
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}