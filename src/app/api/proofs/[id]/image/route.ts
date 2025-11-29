import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Pobierz ID z params (w Next.js 15 params jest Promise'm, w starszych obiektem - zakładam Next 15/16 po strukturze projektu)
    const { id } = await params;

    if (!id) {
      return new NextResponse("Missing ID", { status: 400 });
    }

    // Walidacja sesji - opcjonalna jeśli obrazki mają być publiczne dla innych,
    // ale tutaj sprawdzamy czy użytkownik ma prawo (np. jest właścicielem lub w grupie).
    // Na razie uproszczenie: zalogowany użytkownik.
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const proof = await prisma.proof.findUnique({
      where: { id: parseInt(id) },
      select: { proofImage: true, userId: true }
    });

    if (!proof || !proof.proofImage) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Opcjonalnie: Sprawdź uprawnienia (czy user to właściciel dowodu)
    // if (proof.userId !== session.user.id) { ... }

    // Zwróć obraz
    // Zakładamy, że to np. JPEG/PNG. Jeśli nie przechowujesz MIME type, przeglądarka często sama zgadnie,
    // ale lepiej byłoby przechowywać typ w bazie. Tu zwrócimy jako application/octet-stream lub image/jpeg domyślnie.
    
    return new NextResponse(new Blob([proof.proofImage as any]), {
      headers: {
        "Content-Type": "image/jpeg", // Można próbować detekcji lub dodać pole mimeType do bazy
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving proof image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
