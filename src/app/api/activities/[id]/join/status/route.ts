import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ status: "NONE" });
    }

    const activityId = parseInt(id);

    const request = await prisma.joinRequest.findFirst({
      where: {
        userId: session.user.id,
        activityId: activityId,
        status: "PENDING",
      },
    });

    if (request) {
      return NextResponse.json({ status: "PENDING" });
    }

    const participant = await prisma.activityParticipant.findUnique({
        where: {
            userId_activityId: {
                userId: session.user.id,
                activityId: activityId
            }
        }
    })

    if (participant) {
        return NextResponse.json({ status: "MEMBER" });
    }

    return NextResponse.json({ status: "NONE" });
  } catch (error) {
    return NextResponse.json({ status: "NONE" });
  }
}
