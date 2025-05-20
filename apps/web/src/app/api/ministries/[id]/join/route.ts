import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { id }: { id: string } = await params;
        const ministryMember = await prisma.ministryMember.create({
            data: {
                ministryId: id,
                userId: session.user.id,
                role: "MEMBER",
            },
        });

        return NextResponse.json(ministryMember);
    } catch (error) {
        console.error("[MINISTRY_JOIN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
