import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../../../prisma/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lessonId, proposedChanges } = await req.json();
    if (!lessonId || !proposedChanges) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const proposal = await prisma.modificationProposal.create({
      data: {
        userId: user.id,
        lessonId,
        proposedChanges: JSON.stringify(proposedChanges),
      },
    });

    return NextResponse.json({ success: true, proposalId: proposal.id }, { status: 200 });
  } catch (error) {
    console.error("Proposal error:", error);
    return NextResponse.json({ error: "Failed to submit proposal" }, { status: 500 });
  }
}
