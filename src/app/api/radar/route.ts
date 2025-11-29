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

    // 2. Znajdź użytkowników, którzy mają przynajmniej jedno wspólne zainteresowanie
    const matchedUsers = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        interests: {
          some: {
            id: { in: interestIds },
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        interests: true, // Pobierz bezpośrednio listę zainteresowań
        sessions: {
          where: {
            expiresAt: { gt: new Date() },
          },
          take: 1,
        },
      },
    });

    // 3. Przetwórz dane
    const result = matchedUsers.map((user) => {
      const userInterestIds = user.interests.map((i) => i.id);
      
      const commonInterestsCount = userInterestIds.filter((id) => 
        interestIds.includes(id)
      ).length;

      const isOnline = user.sessions.length > 0;

      return {
        id: user.id,
        name: user.name,
        image: user.image,
        isOnline,
        commonInterestsCount,
        interests: user.interests.map((i) => i.name),
      };
    });

    // 4. Sortuj
    result.sort((a, b) => b.commonInterestsCount - a.commonInterestsCount);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching radar matches:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}