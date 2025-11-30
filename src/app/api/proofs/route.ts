import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Pobierz dowody dla celu (wymaga goalId w query param)
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
  
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get("goalId");

    if (!goalId) {
        return NextResponse.json({ error: "Missing goalId" }, { status: 400 });
    }

    // Check if user has access to the goal
    const goal = await prisma.goal.findUnique({
        where: { id: parseInt(goalId) },
        include: { activity: { include: { participants: true } } }
    });

    if (!goal) {
        return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const isParticipant = goal.activity.participants.some(p => p.userId === session.user.id);
    if (!isParticipant) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const proofs = await prisma.proof.findMany({
      where: { goalId: parseInt(goalId) },
      include: {
          user: {
              select: {
                  id: true,
                  name: true,
                  image: true
              }
          }
      },
      orderBy: { createdAt: 'desc' },
      // Note: We are not selecting proofImage here to keep response light. 
      // A separate endpoint might be needed to serve the image content.
    });

    // Transform response to avoid sending binary data directly if included by default in findMany (it's not unless selected, but good practice)
    const safeProofs = proofs.map(proof => ({
        id: proof.id,
        goalId: proof.goalId,
        userId: proof.userId,
        createdAt: proof.createdAt,
        user: proof.user
    }));

    return NextResponse.json(safeProofs);
  } catch (error) {
    console.error("Error fetching proofs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Dodaj dowód (obrazek) do celu
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
  
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    const formData = await request.formData();
    const goalId = formData.get("goalId");
    const file = formData.get("file") as File;

    if (!goalId || !file) {
      return NextResponse.json({ error: "Missing goalId or file" }, { status: 400 });
    }

    // Weryfikacja czy user ma dostęp do celu (jest w aktywności)
    const goal = await prisma.goal.findUnique({
        where: { id: parseInt(goalId.toString()) },
        include: { activity: { include: { participants: true } } }
    });

    if (!goal) {
         return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const isParticipant = goal.activity.participants.some(p => p.userId === session.user.id);
    if (!isParticipant) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check if user already uploaded a proof for this goal
    const existingProof = await prisma.proof.findFirst({
        where: {
            goalId: parseInt(goalId.toString()),
            userId: session.user.id
        }
    });

    if (existingProof) {
        return NextResponse.json({ error: "You have already submitted a proof for this goal" }, { status: 400 });
    }

    // Konwersja File na Buffer/Bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const proof = await prisma.proof.create({
      data: {
        goalId: parseInt(goalId.toString()),
        userId: session.user.id,
        proofImage: buffer,
      },
      select: {
          id: true,
          goalId: true,
          createdAt: true
      }
    });
    
    return NextResponse.json(proof, { status: 201 });
  } catch (error) {
    console.error("Error creating proof:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}