import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const rawInterests = body?.interests;

    if (!Array.isArray(rawInterests)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // normalize and validate items are strings
    const interests = Array.from(new Set(rawInterests
      .filter((v: any) => typeof v === 'string')
      .map((s: string) => s.trim())
    ));

    // server-side limit enforcement
    if (interests.length === 0) {
      return NextResponse.json({ error: 'No interests provided' }, { status: 400 });
    }

    if (interests.length > 4) {
      return NextResponse.json({ error: 'Maximum 4 interests allowed' }, { status: 400 });
    }

    // disallow selecting non-interactive/scene items
    const forbidden = ['podloga', 'sciana', 'polki'];
    const lower = interests.map((i: string) => i.toLowerCase());
    const selectedForbidden = forbidden.filter(f => lower.includes(f));
    if (selectedForbidden.length > 0) {
      return NextResponse.json({ error: `Invalid selection: ${selectedForbidden.join(', ')}` }, { status: 400 });
    }

    // ensure all requested interest names exist in DB
    const interestRecords = await prisma.interest.findMany({
      where: {
        name: { in: interests }
      }
    });

    const foundNames = interestRecords.map(i => i.name);
    const missing = interests.filter((i: string) => !foundNames.includes(i));
    if (missing.length > 0) {
      return NextResponse.json({ error: 'Unknown interests: ' + missing.join(', ') }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        interests: {
          set: [], // Clear existing
          connect: interestRecords.map(i => ({ id: i.id }))
        }
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error updating interests:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
