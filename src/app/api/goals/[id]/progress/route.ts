import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Pobierz progress użytkownika dla danego celu
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
          headers: await headers(),
        });
    
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: goalId } = await params;

        const progress = await prisma.progress.findUnique({
            where: {
                userId_goalId: {
                    userId: session.user.id,
                    goalId: parseInt(goalId)
                }
            }
        });

        // Jeśli brak wpisu, zwracamy domyślny (nieukończone)
        if (!progress) {
            return NextResponse.json({ isCompleted: false });
        }

        return NextResponse.json(progress);

    } catch (error) {
        console.error("Error fetching progress:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST/PATCH: Przełącz status isCompleted
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({
          headers: await headers(),
        });
    
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: goalId } = await params;
        const body = await request.json();
        const { isCompleted } = body; // true / false

        if (typeof isCompleted !== 'boolean') {
            return NextResponse.json({ error: "isCompleted (boolean) is required" }, { status: 400 });
        }

        const progress = await prisma.progress.upsert({
            where: {
                userId_goalId: {
                    userId: session.user.id,
                    goalId: parseInt(goalId)
                }
            },
            update: {
                isCompleted,
                completedAt: isCompleted ? new Date() : null,
            },
            create: {
                userId: session.user.id,
                goalId: parseInt(goalId),
                isCompleted,
                completedAt: isCompleted ? new Date() : null,
            }
        });

        return NextResponse.json(progress);

    } catch (error) {
        console.error("Error updating progress:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}