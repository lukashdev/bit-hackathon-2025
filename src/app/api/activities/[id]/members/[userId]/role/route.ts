import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, userId } = await params;
    const activityId = parseInt(id);

    if (isNaN(activityId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { role } = body; // "ADMIN" or "MEMBER"

    if (!["ADMIN", "MEMBER"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if requester is OWNER
    const requester = await prisma.activityParticipant.findUnique({
        where: {
            userId_activityId: {
                userId: session.user.id,
                activityId: activityId
            }
        }
    });

    if (!requester || requester.role !== "OWNER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update role
    const updatedParticipant = await prisma.activityParticipant.update({
        where: {
            userId_activityId: {
                userId: userId,
                activityId: activityId
            }
        },
        data: { role }
    });

    return NextResponse.json(updatedParticipant);

  } catch (error) {
    console.error("Error updating member role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
