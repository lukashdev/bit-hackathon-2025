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

    const activityId = parseInt(id);
    const userId = session.user.id;

    // Check if member
    const participant = await prisma.activityParticipant.findUnique({
      where: {
        userId_activityId: {
          userId,
          activityId,
        },
      },
    });

    if (!participant) {
      return NextResponse.json({ error: "Not a member" }, { status: 404 });
    }

    if (participant.role === "OWNER") {
        // Optional: Prevent owner from leaving without transferring ownership
        // For now, let's allow it but maybe warn in frontend? 
        // Or better, if owner leaves, we should probably check if there are other admins/members.
        // Let's keep it simple: Owner cannot leave via this endpoint, must delete activity or transfer.
        return NextResponse.json({ error: "Owner cannot leave activity. Transfer ownership or delete activity." }, { status: 403 });
    }

    await prisma.activityParticipant.delete({
      where: {
        userId_activityId: {
          userId,
          activityId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error leaving activity:", error);
    return NextResponse.json(
      { error: "Failed to leave activity" },
      { status: 500 }
    );
  }
}
