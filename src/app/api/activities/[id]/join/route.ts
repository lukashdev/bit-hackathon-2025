import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(
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

    // Check if already a member
    const existingMember = await prisma.activityParticipant.findUnique({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: activityId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    // Check if already requested
    const existingRequest = await prisma.joinRequest.findFirst({
      where: {
        userId: session.user.id,
        activityId: activityId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return NextResponse.json({ error: "Request already pending" }, { status: 409 });
    }

    const joinRequest = await prisma.joinRequest.create({
      data: {
        userId: session.user.id,
        activityId: activityId,
        status: "PENDING",
      },
    });

    return NextResponse.json(joinRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating join request:", error);
    return NextResponse.json(
      { error: "Failed to create join request" },
      { status: 500 }
    );
  }
}

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

    // Check if request exists
    const existingRequest = await prisma.joinRequest.findFirst({
      where: {
        userId: session.user.id,
        activityId: activityId,
        status: "PENDING",
      },
    });

    if (!existingRequest) {
      return NextResponse.json({ error: "No pending request found" }, { status: 404 });
    }

    await prisma.joinRequest.delete({
      where: {
        id: existingRequest.id
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling join request:", error);
    return NextResponse.json(
      { error: "Failed to cancel join request" },
      { status: 500 }
    );
  }
}
