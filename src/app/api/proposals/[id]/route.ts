import { NextResponse } from "next/server";
import { prisma } from "@/../prisma/db";
import { getServerSession } from "next-auth/next";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession();
  const { id } = await params;

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { status } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const proposal = await prisma.modificationProposal.findUnique({
      where: { id },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    if (status === "APPROVED") {
      const changes = JSON.parse(proposal.proposedChanges);
      
      // Update the lesson with proposed changes
      await prisma.lesson.update({
        where: { id: proposal.lessonId },
        data: changes,
      });
    }

    const updatedProposal = await prisma.modificationProposal.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedProposal);
  } catch (error: any) {
    return NextResponse.json({ error: "Error updating proposal", details: error.message }, { status: 500 });
  }
}
