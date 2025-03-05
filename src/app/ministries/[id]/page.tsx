import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import MinistryNotices from "@/components/ministry/MinistryNotices";
import MinistrySchedules from "@/components/ministry/MinistrySchedules";
import { Button } from "@heroui/react";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ id: string }>;
}

async function joinMinistry(ministryId: string) {
    "use server";

    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    await prisma.ministryMember.create({
        data: {
            ministryId: ministryId,
            userId: session.user.id,
            role: "MEMBER",
        },
    });

    // Refresh the page to show updated membership status
    redirect(`/ministries/${ministryId}`);
}

export default async function MinistryPage({ params }: Props) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const { id } = await params;

    // 사역팀 정보와 관련 데이터를 한 번에 조회
    const ministry = await prisma.ministry.findUnique({
        where: { id: id },
        include: {
            _count: {
                select: { members: true },
            },
            members: {
                where: { userId: session.user.id },
            },
            positions: true,
            notices: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                    events: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
            schedules: {
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                    position: true,
                },
                orderBy: {
                    date: "asc",
                },
            },
        },
    });

    if (!ministry) {
        redirect("/ministries");
    }

    // Transform dates to strings for serialization
    const serializedMinistry = {
        ...ministry,
        notices: ministry.notices.map((notice) => ({
            ...notice,
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
        positions: ministry.positions,
    };

    const isMember = ministry.members.length > 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-primary">
                            {ministry.name}
                        </h1>
                        {!isMember && (
                            <form
                                action={async () => {
                                    "use server";
                                    await joinMinistry(ministry.id);
                                }}
                            >
                                <Button type="submit" color="primary">
                                    사역팀 가입
                                </Button>
                            </form>
                        )}
                    </div>
                    <p className="mt-2 text-gray-500">{ministry.description}</p>
                    <p className="mt-1 text-sm text-gray-500">멤버 {ministry._count.members}명</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 공지사항 섹션 */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">공지사항</h2>
                        <MinistryNotices notices={serializedMinistry.notices} />
                    </div>

                    {/* 일정 섹션 */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">일정</h2>
                        <MinistrySchedules
                            schedules={serializedMinistry.schedules}
                            notices={serializedMinistry.notices}
                            positions={serializedMinistry.positions}
                            userMinistries={[ministry.id]}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
