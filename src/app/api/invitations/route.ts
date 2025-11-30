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

    const invitations = await prisma.invitation.findMany({
      where: {
        receiverId: session.user.id,
        status: "PENDING"
      },
      include: {
        sender: {
            select: {
                id: true,
                name: true,
                image: true
            }
        },
        activity: {
            select: {
                id: true,
                name: true
            }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
