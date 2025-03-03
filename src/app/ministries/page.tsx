import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Card, CardHeader, CardBody, Avatar, ScrollShadow } from "@heroui/react";
import { UserGroupIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default async function MinistriesPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // 현재 로그인한 유저가 속한 교회의 사역팀 목록을 가져옵니다
    const churchMember = await prisma.churchMember.findFirst({
        where: { userId: session.user.id },
        include: { church: true },
    });

    if (!churchMember) {
        redirect("/onboarding");
    }

    const ministries = await prisma.ministry.findMany({
        where: { churchId: churchMember.church.id },
        include: {
            _count: {
                select: { members: true },
            },
            notices: {
                take: 3,
                orderBy: { createdAt: "desc" },
                include: {
                    user: true,
                },
            },
        },
    });

    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            {/* 사역팀 Avatar 스크롤 섹션 */}
            <div className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 md:top-0">
                <ScrollShadow
                    orientation="horizontal"
                    className="flex gap-4 p-4 overflow-x-auto hide-scrollbar"
                >
                    {ministries.map((ministry) => (
                        <div
                            key={ministry.id}
                            className="flex flex-col items-center gap-1 min-w-[64px]"
                        >
                            <Avatar
                                name={ministry.name}
                                size="lg"
                                isBordered
                                color="primary"
                                className="w-16 h-16"
                            />
                            <span className="text-xs text-center">{ministry.name}</span>
                            <span className="text-[10px] text-default-500">
                                {ministry._count.members}명
                            </span>
                        </div>
                    ))}
                </ScrollShadow>
            </div>

            {/* 사역팀 피드 섹션 */}
            <main className="container max-w-2xl mx-auto px-4 pt-36 md:pt-28">
                <div className="space-y-6">
                    {ministries.map((ministry) => (
                        <Card key={ministry.id} className="w-full">
                            <CardHeader className="flex gap-3">
                                <Avatar name={ministry.name} size="md" isBordered color="primary" />
                                <div className="flex flex-col">
                                    <p className="text-md font-semibold">{ministry.name}</p>
                                    <p className="text-small text-default-500">
                                        팀원 {ministry._count.members}명
                                    </p>
                                </div>
                            </CardHeader>

                            <CardBody className="px-4 py-3">
                                <div className="flex items-center gap-2 mb-4">
                                    <UserGroupIcon className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold">사역팀 소개</h2>
                                </div>
                                <p className="text-gray-600 mb-6">
                                    {ministry.description || "사역팀 소개가 없습니다."}
                                </p>

                                {ministry.notices.length > 0 && (
                                    <>
                                        <div className="flex items-center gap-2 mb-4">
                                            <CalendarIcon className="w-5 h-5 text-primary" />
                                            <h2 className="text-lg font-semibold">최근 공지사항</h2>
                                        </div>
                                        <div className="space-y-3">
                                            {ministry.notices.map((notice) => (
                                                <div
                                                    key={notice.id}
                                                    className="p-3 rounded-lg bg-default-50"
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Avatar
                                                            name={notice.user.name || ""}
                                                            size="sm"
                                                        />
                                                        <span className="text-sm font-medium">
                                                            {notice.user.name}
                                                        </span>
                                                        <span className="text-xs text-default-500">
                                                            {new Date(
                                                                notice.createdAt
                                                            ).toLocaleDateString("ko-KR")}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-medium mb-1">
                                                        {notice.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {notice.content}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
