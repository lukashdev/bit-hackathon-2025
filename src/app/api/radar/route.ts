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

    // 1. Pobierz ID zainteresowań aktualnego użytkownika
    const currentUserInterests = await prisma.userInterest.findMany({
      where: { userId: currentUserId },
      select: { interestId: true },
    });

    const interestIds = currentUserInterests.map((ui) => ui.interestId);

    if (interestIds.length === 0) {
      return NextResponse.json([]); // Jeśli user nie ma zainteresowań, nie ma kogo dopasować
    }

    // 2. Znajdź użytkowników, którzy mają przynajmniej jedno wspólne zainteresowanie
    // Pobieramy też sesje, aby sprawdzić status online
    const matchedUsers = await prisma.user.findMany({
      where: {
        id: { not: currentUserId }, // Nie pobieraj siebie
        interests: {
          some: {
            interestId: { in: interestIds },
          },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        interests: {
          include: {
            interest: true,
          },
        },
        sessions: {
          where: {
            expiresAt: { gt: new Date() },
          },
          take: 1, // Wystarczy jedna aktywna sesja
        },
      },
    });

    // 3. Przetwórz dane: oblicz dopasowanie i sformatuj odpowiedź
    const result = matchedUsers.map((user) => {
      const userInterestIds = user.interests.map((ui) => ui.interest.id);
      
      // Oblicz liczbę wspólnych zainteresowań
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
        interests: user.interests.map((ui) => ui.interest.name),
      };
    });

    // 4. Sortuj malejąco po liczbie wspólnych zainteresowań
    result.sort((a, b) => b.commonInterestsCount - a.commonInterestsCount);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching radar matches:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
