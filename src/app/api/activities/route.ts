import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";

// GET: Pobierz aktywności użytkownika
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session.user.id;

    const activities = await prisma.activity.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        participants: {
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true
                    }
                }
            }
        },
        goals: {
            include: {
                progress: {
                    where: { userId: userId }
                }
            }
        }, // Dołącz cele aktywności z progresem użytkownika
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Utwórz nową aktywność
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, goals } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // AI Interest Selection Logic
    let selectedInterestIds: number[] = [];
    
    try {
        // 1. Fetch user interests
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { interests: true }
        });
        const userInterests = user?.interests.map(i => i.name).join(", ") || "Brak";

        // 2. Fetch all available interests
        const allInterests = await prisma.interest.findMany();
        const allInterestsNames = allInterests.map(i => i.name).join(", ");

        // 3. Call Gemini
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-preview-02-05" });

            const prompt = `
              Jesteś asystentem AI, który kategoryzuje aktywności.
              
              Zadanie: Wybierz najbardziej pasujące zainteresowania dla nowej aktywności z podanej listy.
              
              Kontekst:
              - Nazwa aktywności: "${name}"
              - Opis aktywności: "${description || ''}"
              - Zainteresowania twórcy: "${userInterests}"
              
              Lista dostępnych zainteresowań: ${allInterestsNames}
              
              Instrukcje:
              1. Przeanalizuj nazwę i opis aktywności, aby zrozumieć jej temat.
              2. Rozważ zainteresowania twórcy jako wskazówkę, ale priorytet ma treść aktywności.
              3. Wybierz od 1 do 3 zainteresowań z "Lista dostępnych zainteresowań", które najlepiej pasują.
              4. Zwróć TYLKO tablicę JSON z nazwami wybranych zainteresowań (np. ["Sport", "Muzyka"]).
              5. Jeśli żadne zainteresowanie nie pasuje, zwróć pustą tablicę [].
              6. NIE zwracaj żadnego formatowania markdown (np. \`\`\`json). Tylko czysty JSON.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            // Clean up response
            const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            
            try {
                const selectedNames = JSON.parse(cleanedText);
                if (Array.isArray(selectedNames)) {
                    selectedInterestIds = allInterests
                        .filter(i => selectedNames.includes(i.name))
                        .map(i => i.id);
                }
            } catch (e) {
                console.error("Failed to parse AI response:", text);
            }
        }
    } catch (error) {
        console.error("AI categorization error:", error);
        // Continue without interests if AI fails
    }

    const activity = await prisma.$transaction(async (tx) => {
      const newActivity = await tx.activity.create({
        data: {
          name,
          description,
          interests: {
            connect: selectedInterestIds.map(id => ({ id }))
          }
        },
      });

      if (goals && Array.isArray(goals)) {
        await tx.goal.createMany({
          data: goals.map((goal: any) => ({
            activityId: newActivity.id,
            title: goal.title,
            description: goal.description,
            startDate: new Date(goal.startDate),
            endDate: new Date(goal.endDate),
          })),
        });
      }

      await tx.activityParticipant.create({
        data: {
          userId: session.user.id,
          activityId: newActivity.id,
          role: "OWNER",
        },
      });

      return newActivity;
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}