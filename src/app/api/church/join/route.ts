import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { churchId } = body;

        if (!churchId) {
            return new NextResponse("Church ID is required", { status: 400 });
        }

        // Check if church exists
        const church = await prisma.church.findUnique({
            where: { id: churchId },
        });

        if (!church) {
            return new NextResponse("Church not found", { status: 404 });
        }

        // Create church member with PENDING status
        const churchMember = await prisma.churchMember.create({
            data: {
                userId: session.user.id,
                churchId,
                role: "PENDING",
            },
        });

        return NextResponse.json(churchMember);
    } catch (error) {
        console.error("[CHURCH_JOIN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
