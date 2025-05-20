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
        const { ministryId, date, positionId } = body;

        if (!ministryId || !date || !positionId) {
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

        // 선택한 날짜가 일요일인지 확인
        const selectedDate = new Date(date);
        if (selectedDate.getDay() !== 0) {
            return new NextResponse("Schedule can only be created for Sundays", { status: 400 });
        }

        // 이미 같은 날짜에 신청한 일정이 있는지 확인
        const existingSchedule = await prisma.ministrySchedule.findFirst({
            where: {
                ministryId,
                userId: session.user.id,
                date: selectedDate,
            },
        });

        if (existingSchedule) {
            return new NextResponse("Already applied for this date", { status: 400 });
        }

        // 해당 포지션의 최대 인원 확인
        const position = await prisma.ministryPosition.findUnique({
            where: { id: positionId },
        });

        if (!position) {
            return new NextResponse("Position not found", { status: 404 });
        }

        // 해당 날짜와 포지션에 대한 현재 신청자 수 확인
        if (position.maxMembers) {
            const currentApplicants = await prisma.ministrySchedule.count({
                where: {
                    ministryId,
                    positionId,
                    date: selectedDate,
                },
            });

            if (currentApplicants >= position.maxMembers) {
                return new NextResponse("Position is full for this date", { status: 400 });
            }
        }

        // 일정 생성
        const schedule = await prisma.ministrySchedule.create({
            data: {
                ministryId,
                positionId,
                userId: session.user.id,
                date: selectedDate,
                status: "PENDING", // 기본값은 승인 대기 상태
            },
            include: {
                position: true,
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
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
                position: true, // 포지션 정보 포함
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
