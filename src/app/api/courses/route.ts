import { NextResponse } from "next/server";
import { prisma } from "@/../prisma/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, slug, description, engine, category } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ message: "Name and Slug are required" }, { status: 400 });
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        slug,
        description,
        category: category || "General",
        engine: engine || "REACT",
        creatorId: (session.user as any).id,
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "A course with this slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error creating course", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(topics);
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching courses" }, { status: 500 });
  }
}
