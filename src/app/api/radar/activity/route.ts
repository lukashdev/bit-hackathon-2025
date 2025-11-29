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

    const currentUserId = session.user.id;

    // 1. Pobierz zainteresowania aktualnego użytkownika
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { 
        interests: { select: { id: true } }
      }
    });

    if (!currentUser || currentUser.interests.length === 0) {
      return NextResponse.json([]); 
    }

    const interestIds = currentUser.interests.map(i => i.id);

    // 2. Znajdź aktywności, które mają przynajmniej jedno wspólne zainteresowanie
    // i w których użytkownik NIE bierze udziału
    const matchedActivities = await prisma.activity.findMany({
      where: {
        interests: {
          some: {
            id: { in: interestIds },
          },
        },
        participants: {
          none: {
            userId: currentUserId
          }
        }
      },
      include: {
        interests: true,
        _count: {
          select: { participants: true }
        }
      },
    });

    // 3. Przetwórz dane
    const result = matchedActivities.map((activity) => {
      const activityInterestIds = activity.interests.map((i) => i.id);
      
      const commonInterestsCount = activityInterestIds.filter((id) => 
        interestIds.includes(id)
      ).length;

      return {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        participantsCount: activity._count.participants,
        commonInterestsCount,
        interests: activity.interests.map((i) => i.name),
      };
    });

    // 4. Sortuj
    result.sort((a, b) => b.commonInterestsCount - a.commonInterestsCount);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching activity radar matches:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
