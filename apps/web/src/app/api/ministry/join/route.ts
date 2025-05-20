import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const ministryId = searchParams.get("ministryId");

        if (!ministryId) {
            return new NextResponse("Ministry ID is required", { status: 400 });
        }

        // 이미 가입된 멤버인지 확인
        const existingMember = await prisma.ministryMember.findFirst({
            where: {
                userId: session.user.id,
                ministryId,
            },
        });

        if (existingMember) {
            return new NextResponse("Already a member", { status: 400 });
        }

        // 새로운 멤버로 가입 (기본 역할: MEMBER)
        const member = await prisma.ministryMember.create({
            data: {
                userId: session.user.id,
                ministryId,
                role: "MEMBER", // 기본 역할
            },
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error("[MINISTRY_JOIN]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
