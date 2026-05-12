import { NextResponse } from "next/server";
import { prisma } from "@/../prisma/db";
import { getServerSession } from "next-auth/next";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const { id: topicId } = await params;

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    
    // Find the current max order for this topic
    const lastLesson = await prisma.lesson.findFirst({
      where: { topicId },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    const nextOrder = (lastLesson?.order ?? -1) + 1;

    const lesson = await prisma.lesson.create({
      data: {
        ...data,
        topicId,
        order: nextOrder,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating lesson", error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: topicId } = await params;
  
  try {
    const lessons = await prisma.lesson.findMany({
      where: { topicId },
      orderBy: { order: 'asc' }
    });
    return NextResponse.json(lessons);
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching lessons" }, { status: 500 });
  }
}
