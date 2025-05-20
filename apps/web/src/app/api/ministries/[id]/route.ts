import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import type { Ministry } from "@/types/ministry";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<Ministry | { error: string }>> {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { id } = await params;

        // 단일 쿼리로 필요한 데이터만 조회
        const ministry = await prisma.ministry.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                _count: {
                    select: {
                        members: true,
                    },
                },
                members: {
                    where: {
                        userId: session.user.id,
                    },
                    select: {
                        userId: true,
                        role: true,
                    },
                },
                positions: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        maxMembers: true,
                    },
                },
                notices: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        startDate: true,
                        endDate: true,
                        createdAt: true,
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                        events: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                location: true,
                                eventDate: true,
                                startTime: true,
                                endTime: true,
                                maxAttendees: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                schedules: {
                    select: {
                        id: true,
                        date: true,
                        status: true,
                        user: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                        position: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                maxMembers: true,
                            },
                        },
                    },
                    orderBy: {
                        date: "asc",
                    },
                },
                files: {
                    select: {
                        id: true,
                        name: true,
                        url: true,
                        type: true,
                        size: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        });

        if (!ministry) {
            return new NextResponse("Ministry not found", { status: 404 });
        }

        // 날짜 직렬화
        const serializedMinistry = {
            ...ministry,
            notices: ministry.notices.map((notice) => ({
                ...notice,
                startDate: notice.startDate.toISOString(),
                endDate: notice.endDate.toISOString(),
                createdAt: notice.createdAt.toISOString(),
                events: notice.events.map((event) => ({
                    ...event,
                    eventDate: event.eventDate.toISOString(),
                    startTime: event.startTime.toISOString(),
                    endTime: event.endTime.toISOString(),
                })),
            })),
            schedules: ministry.schedules.map((schedule) => ({
                ...schedule,
                date: schedule.date.toISOString(),
            })),
            files: ministry.files.map((file) => ({
                ...file,
                createdAt: file.createdAt.toISOString(),
            })),
        } satisfies Ministry;

        return NextResponse.json(serializedMinistry);
    } catch (error) {
        console.error("[MINISTRY_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
