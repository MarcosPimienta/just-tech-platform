import { NextResponse } from "next/server";
import { prisma } from "@/../prisma/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { name, description, category, engine } = await req.json();

  try {
    const topic = await prisma.topic.findUnique({ where: { id } });
    if (!topic) return NextResponse.json({ message: "Course not found" }, { status: 404 });

    // Only creator or ADMIN can edit
    if (topic.creatorId !== (session.user as any).id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.topic.update({
      where: { id },
      data: { name, description, category, engine },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating course" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    const topic = await prisma.topic.findUnique({ where: { id } });
    if (!topic) return NextResponse.json({ message: "Course not found" }, { status: 404 });

    if (topic.creatorId !== (session.user as any).id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Cascade delete lessons and progress? Prisma handles if defined, but here we do it manually or via schema
    // In our schema lessons are not set to cascade delete automatically in SQLite usually unless specified
    await prisma.lesson.deleteMany({ where: { topicId: id } });
    await prisma.topic.delete({ where: { id } });

    return NextResponse.json({ message: "Course deleted" });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting course" }, { status: 500 });
  }
}
