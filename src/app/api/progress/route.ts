import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../prisma/db";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ completed: [] }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { progress: true },
    });

    const completed = user?.progress.map((p) => p.lessonId) || [];
    
    return NextResponse.json({ completed }, { status: 200 });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId } = await req.json();
    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert the progress record
    await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        lessonId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Progress update error:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
