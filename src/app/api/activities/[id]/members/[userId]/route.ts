import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
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

    // Check if requester is OWNER or ADMIN
    const requester = await prisma.activityParticipant.findUnique({
        where: {
            userId_activityId: {
                userId: session.user.id,
                activityId: activityId
            }
        }
    });

    if (!requester || !["OWNER", "ADMIN"].includes(requester.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get target user role
    const targetUser = await prisma.activityParticipant.findUnique({
        where: {
            userId_activityId: {
                userId: userId,
                activityId: activityId
            }
        }
    });

    if (!targetUser) {
        return NextResponse.json({ error: "User not found in activity" }, { status: 404 });
    }


    if (requester.role === "ADMIN") {
        if (targetUser.role === "OWNER" || targetUser.role === "ADMIN") {
             return NextResponse.json({ error: "Forbidden: Admins cannot remove other Admins or Owners" }, { status: 403 });
        }
    }

    // Remove user
    await prisma.activityParticipant.delete({
        where: {
            userId_activityId: {
                userId: userId,
                activityId: activityId
            }
        }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
