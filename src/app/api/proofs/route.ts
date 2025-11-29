import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Pobierz dowody dla zadania (wymaga taskId w query param)
export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
  
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
        return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    // Sprawdź czy zadanie należy do usera (lub czy jest to publiczne zadanie w przyszłości)
    const task = await prisma.task.findUnique({
        where: { id: parseInt(taskId) },
    });

    if (!task || task.userId !== Number(session.user.id)) {
         return NextResponse.json({ error: "Task not found or access denied" }, { status: 403 });
    }

    const proofs = await prisma.taskProof.findMany({
      where: { taskId: parseInt(taskId) },
      select: {
          id: true,
          taskId: true,
          createdAt: true,
          // Nie pobieramy proofImage domyślnie, bo może być duży. 
          // Zrobimy osobny endpoint do pobierania samej grafiki, 
          // lub można zwrócić base64 jeśli pliki są małe.
          // Tutaj dla uproszczenia zwrócę ID, a grafikę pobierzemy przez dedykowany URL.
      } 
    });

    return NextResponse.json(proofs);
  } catch (error) {
    console.error("Error fetching proofs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Dodaj dowód (obrazek)
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
  
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    const formData = await request.formData();
    const taskId = formData.get("taskId");
    const file = formData.get("file") as File;

    if (!taskId || !file) {
      return NextResponse.json({ error: "Missing taskId or file" }, { status: 400 });
    }

    // Weryfikacja własności zadania
    const task = await prisma.task.findUnique({
        where: { id: parseInt(taskId.toString()) }
    });

    if (!task || task.userId !== Number(session.user.id)) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Konwersja File na Buffer/Bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const proof = await prisma.taskProof.create({
      data: {
        taskId: parseInt(taskId.toString()),
        userId: Number(session.user.id),
        proofImage: buffer,
      },
      // Nie zwracamy pełnego obiektu z Bytes w odpowiedzi JSON, żeby nie zapchać sieci
      select: {
          id: true,
          taskId: true,
          createdAt: true
      }
    });

    return NextResponse.json(proof, { status: 201 });
  } catch (error) {
    console.error("Error creating proof:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
