import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { ministryId, title, content } = body;

        if (!ministryId || !title || !content) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // 사용자가 해당 사역팀의 리더인지 확인
        const member = await prisma.ministryMember.findFirst({
            where: {
                userId: session.user.id,
                ministryId,
                role: "LEADER",
            },
        });

        if (!member) {
            return new NextResponse("Not authorized to create notices", { status: 403 });
        }

        // 공지사항 생성
        const notice = await prisma.ministryNotice.create({
            data: {
                title,
                content,
                ministryId,
                userId: session.user.id,
            },
        });

        return NextResponse.json(notice);
    } catch (error) {
        console.error("[MINISTRY_NOTICE_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// 공지사항 목록 조회
export async function GET(req: NextRequest) {
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

        // 해당 사역팀의 모든 공지사항 조회
        const notices = await prisma.ministryNotice.findMany({
            where: {
                ministryId,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(notices);
    } catch (error) {
        console.error("[MINISTRY_NOTICE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
