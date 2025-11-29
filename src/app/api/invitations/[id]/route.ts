import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const invitationId = parseInt(id);

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: { activity: true }
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Check if user is the sender OR an admin/owner of the activity
    const participant = await prisma.activityParticipant.findUnique({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: invitation.activityId,
        },
      },
    });

    const isSender = invitation.senderId === session.user.id;
    const isAdmin = participant && (participant.role === "OWNER" || participant.role === "ADMIN");

    if (!isSender && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.invitation.delete({
      where: { id: invitationId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return NextResponse.json(
      { error: "Failed to delete invitation" },
      { status: 500 }
    );
  }
}
