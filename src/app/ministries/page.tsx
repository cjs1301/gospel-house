import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { Card, CardHeader, CardBody, Avatar } from "@heroui/react";
import { UserGroupIcon, CalendarIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { MinistryLayout } from "@/components/layouts/MinistryLayout";

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

    const headerContent = ministries.map((ministry) => (
        <Link
            key={ministry.id}
            href={`/ministries/${ministry.id}`}
            className="flex flex-col items-center gap-1 min-w-[64px] hover:opacity-80 transition-opacity"
        >
            <Avatar
                name={ministry.name}
                size="lg"
                isBordered
                color="primary"
                className="w-16 h-16"
            />
            <span className="text-xs text-center">{ministry.name}</span>
            <span className="text-[10px] text-default-500">{ministry._count.members}명</span>
        </Link>
    ));

    const mainContent = ministries.map((ministry) => (
        <Link
            key={ministry.id}
            href={`/ministries/${ministry.id}`}
            className="block hover:opacity-95 transition-opacity"
        >
            <Card className="w-full">
                <CardHeader className="flex gap-3 z-0">
                    <Avatar
                        name={ministry.name}
                        size="md"
                        isBordered
                        color="primary"
                        classNames={{
                            base: "!z-0",
                            fallback: "!z-0",
                        }}
                    />
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
                                    <div key={notice.id} className="p-3 rounded-lg bg-default-50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Avatar name={notice.user.name || ""} size="sm" />
                                            <span className="text-sm font-medium">
                                                {notice.user.name}
                                            </span>
                                            <span className="text-xs text-default-500">
                                                {new Date(notice.createdAt).toLocaleDateString(
                                                    "ko-KR"
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="font-medium mb-1">{notice.title}</h3>
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
        </Link>
    ));

    return <MinistryLayout headerContent={headerContent}>{mainContent}</MinistryLayout>;
}
