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
        const { ministryId, date, position } = body;

        if (!ministryId || !date || !position) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // 사용자가 해당 사역팀의 멤버인지 확인
        const member = await prisma.ministryMember.findFirst({
            where: {
                userId: session.user.id,
                ministryId,
            },
        });

        if (!member) {
            return new NextResponse("Not a ministry member", { status: 403 });
        }

        // 일정 생성
        const schedule = await prisma.ministrySchedule.create({
            data: {
                ministryId,
                userId: session.user.id,
                date: new Date(date),
                position,
                status: "PENDING", // 기본값은 승인 대기 상태
            },
        });

        return NextResponse.json(schedule);
    } catch (error) {
        console.error("[MINISTRY_SCHEDULE_CREATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

// 일정 목록 조회
export async function GET(req: Request) {
    try {
        const session = await auth();

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const ministryId = searchParams.get("ministryId");

        if (!ministryId) {
            return new NextResponse("Ministry ID is required", { status: 400 });
        }

        // 해당 사역팀의 모든 일정 조회
        const schedules = await prisma.ministrySchedule.findMany({
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
                date: "asc",
            },
        });

        return NextResponse.json(schedules);
    } catch (error) {
        console.error("[MINISTRY_SCHEDULE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
