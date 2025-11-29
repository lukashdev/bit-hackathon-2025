import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  try {
    const { id, requestId } = await params;
    const { action } = await request.json(); // action: "APPROVE" | "REJECT"

    if (!["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activityId = parseInt(id);
    const reqId = parseInt(requestId);

    // Check permissions
    const participant = await prisma.activityParticipant.findUnique({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: activityId,
        },
      },
    });

    if (!participant || (participant.role !== "OWNER" && participant.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: reqId },
    });

    if (!joinRequest || joinRequest.status !== "PENDING") {
      return NextResponse.json({ error: "Request not found or already processed" }, { status: 404 });
    }

    if (action === "APPROVE") {
      await prisma.$transaction([
        prisma.joinRequest.update({
          where: { id: reqId },
          data: { status: "APPROVED" },
        }),
        prisma.activityParticipant.create({
          data: {
            userId: joinRequest.userId,
            activityId: activityId,
            role: "MEMBER",
          },
        }),
      ]);
    } else {
      await prisma.joinRequest.update({
        where: { id: reqId },
        data: { status: "REJECTED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing join request:", error);
    return NextResponse.json(
      { error: "Failed to process join request" },
      { status: 500 }
    );
  }
}
