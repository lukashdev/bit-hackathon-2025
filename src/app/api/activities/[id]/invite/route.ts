import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// POST: Zaproś użytkownika (dodaj do aktywności)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 params are async
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id: activityId } = await params;
    const body = await request.json();
    const { email } = body; // Zakładamy zapraszanie po mailu

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 1. Sprawdź czy user wykonujący request jest członkiem aktywności (i ewentualnie czy ma rolę OWNER/ADMIN)
    const requester = await prisma.activityParticipant.findUnique({
        where: {
            userId_activityId: {
                userId: session.user.id,
                activityId: parseInt(activityId)
            }
        }
    });

    if (!requester) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // 2. Znajdź użytkownika do zaproszenia
    const userToInvite = await prisma.user.findUnique({
        where: { email }
    });

    if (!userToInvite) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Sprawdź czy już nie jest członkiem
    const existingParticipant = await prisma.activityParticipant.findUnique({
        where: {
            userId_activityId: {
                userId: userToInvite.id,
                activityId: parseInt(activityId)
            }
        }
    });

    if (existingParticipant) {
        return NextResponse.json({ error: "User is already a participant" }, { status: 409 });
    }

    // 4. Utwórz zaproszenie (zamiast dodawać bezpośrednio)
    // Sprawdź czy już nie ma zaproszenia
    const existingInvitation = await prisma.invitation.findFirst({
        where: {
            activityId: parseInt(activityId),
            receiverId: userToInvite.id,
            status: "PENDING"
        }
    });

    if (existingInvitation) {
        return NextResponse.json({ error: "Invitation already sent" }, { status: 409 });
    }

    const invitation = await prisma.invitation.create({
        data: {
            senderId: session.user.id,
            receiverId: userToInvite.id,
            activityId: parseInt(activityId),
            status: "PENDING"
        }
    });

    return NextResponse.json(invitation, { status: 201 });

  } catch (error) {
    console.error("Error inviting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}