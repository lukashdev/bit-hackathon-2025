import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

    const { id } = await params;
    const proofId = parseInt(id);

    if (isNaN(proofId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if proof exists
    const proof = await prisma.proof.findUnique({
        where: { id: proofId }
    });

    if (!proof) {
        return NextResponse.json({ error: "Proof not found" }, { status: 404 });
    }

    // Prevent liking own proof
    if (proof.userId === session.user.id) {
        return NextResponse.json({ error: "Cannot like your own proof" }, { status: 400 });
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
        where: {
            userId_proofId: {
                userId: session.user.id,
                proofId: proofId
            }
        }
    });

    if (existingLike) {
        // Unlike
        await prisma.like.delete({
            where: {
                userId_proofId: {
                    userId: session.user.id,
                    proofId: proofId
                }
            }
        });
        return NextResponse.json({ liked: false });
    } else {
        // Like
        await prisma.like.create({
            data: {
                userId: session.user.id,
                proofId: proofId
            }
        });
        return NextResponse.json({ liked: true });
    }

  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
