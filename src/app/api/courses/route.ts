import { NextResponse } from "next/server";
import { prisma } from "@/../prisma/db";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, slug, description, engine } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ message: "Name and Slug are required" }, { status: 400 });
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        slug,
        description,
        engine: engine || "REACT",
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
