
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
        interests: {
          include: {
            interest: true,
          },
        },
        tasks: {
            orderBy: { updatedAt: 'desc' }
        },
        goals: {
          where: { isActive: true },
        },
        taskProofs: {
            orderBy: { createdAt: 'desc' },
            take: 1
        }
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate stats
    const totalTasks = user.tasks.length;
    const completedTasks = user.tasks.filter((t) => t.status === "COMPLETED").length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Calculate streak
    // Simple logic: Consecutive days with at least one COMPLETED task, ending today or yesterday.
    let streak = 0;
    const completedTaskDates = user.tasks
      .filter((t) => t.status === "COMPLETED")
      .map((t) => new Date(t.updatedAt).setHours(0, 0, 0, 0)) // Normalize to midnight
      .sort((a, b) => b - a); // Newest first

    // Unique dates
    const uniqueDates = [...new Set(completedTaskDates)];

    if (uniqueDates.length > 0) {
        const today = new Date().setHours(0,0,0,0);
        const yesterday = new Date(today - 86400000).setHours(0,0,0,0);
        
        // Check if streak is active (last completion was today or yesterday)
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

    // Last activity
    let lastActivity = user.updatedAt;
    if (user.tasks.length > 0) {
        const lastTaskTime = user.tasks[0].updatedAt;
        if (lastTaskTime > lastActivity) lastActivity = lastTaskTime;
    }
    if (user.taskProofs.length > 0) {
        const lastProofTime = user.taskProofs[0].createdAt;
        if (lastProofTime > lastActivity) lastActivity = lastProofTime;
    }

    const response = {
      nick: user.name,
      email: user.email,
      streak: streak,
      stats: {
        totalTasks,
        completedTasks,
        progress: Math.round(progress),
      },
      activeGoals: user.goals, // Returns full goal objects
      activeGoalsCount: user.goals.length,
      registrationDate: user.createdAt,
      lastActivity: lastActivity,
      interests: user.interests.map((ui) => ui.interest.name),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
