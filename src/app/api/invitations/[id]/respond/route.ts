import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(
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
    const invitationId = parseInt(id);

    if (isNaN(invitationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const { action } = body; // "accept" or "reject"

    if (!["accept", "reject"].includes(action)) {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId }
    });

    if (!invitation) {
        return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.receiverId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (invitation.status !== "PENDING") {
        return NextResponse.json({ error: "Invitation already responded" }, { status: 400 });
    }

    if (action === "reject") {
        await prisma.invitation.update({
            where: { id: invitationId },
            data: { status: "REJECTED" }
        });
        return NextResponse.json({ success: true, status: "REJECTED" });
    }

    // Accept
    await prisma.$transaction(async (tx) => {
        await tx.invitation.update({
            where: { id: invitationId },
            data: { status: "ACCEPTED" }
        });

        // Add user to activity
        // Check if already participant
        const existingParticipant = await tx.activityParticipant.findUnique({
            where: {
                userId_activityId: {
                    userId: session.user.id,
                    activityId: invitation.activityId
                }
            }
        });

        if (!existingParticipant) {
            await tx.activityParticipant.create({
                data: {
                    userId: session.user.id,
                    activityId: invitation.activityId,
                    role: "MEMBER"
                }
            });
        }
    });

    return NextResponse.json({ success: true, status: "ACCEPTED" });

  } catch (error) {
    console.error("Error responding to invitation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
