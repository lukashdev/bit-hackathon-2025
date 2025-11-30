import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [completedGoals, proofsCount, usersCount, activitiesCount] = await Promise.all([
      prisma.progress.count({ where: { isCompleted: true } }),
      prisma.proof.count(),
      prisma.user.count(),
      prisma.activity.count(),
    ]);

    return NextResponse.json({
      completedGoals,
      proofsCount,
      usersCount,
      activitiesCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
