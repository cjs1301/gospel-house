import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import FeedList from "@/components/FeedList";
import Link from "next/link";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { Card, CardBody, Avatar } from "@heroui/react";

export default async function Home() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    // 현재 로그인한 유저가 속한 교회의 피드를 가져옵니다
    const churchMember = await prisma.churchMember.findFirst({
        where: { userId: session.user.id },
        include: { church: true },
    });

    if (!churchMember) {
        redirect("/onboarding");
    }

    // 교회 피드를 가져옵니다
    const feeds = await prisma.churchFeed.findMany({
        where: { churchId: churchMember.church.id },
        include: {
            author: true,
            images: true,
            comments: {
                include: {
                    user: true,
                },
            },
            likes: {
                where: { userId: session.user.id },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* 헤더 카드 */}
                <Card className="mb-8 bg-gradient-to-r from-primary/10 via-background to-background">
                    <CardBody>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <Avatar
                                    src={churchMember.church.image || "/church-default.png"}
                                    alt={churchMember.church.name}
                                    className="w-16 h-16 md:w-20 md:h-20"
                                />
                                <div>
                                    <p className="text-xl md:text-2xl font-semibold">
                                        {churchMember.church.name}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {churchMember.church.description ||
                                            "교회 소식을 확인하세요"}
                                    </p>
                                    {churchMember.church.address && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {churchMember.church.address}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* 소셜 미디어 링크 */}
                            <div className="flex items-center gap-4">
                                {churchMember.church.instagram && (
                                    <Link
                                        href={churchMember.church.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-primary transition-colors"
                                        title="Instagram"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </Link>
                                )}
                                {churchMember.church.youtube && (
                                    <Link
                                        href={churchMember.church.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-primary transition-colors"
                                        title="YouTube"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    </Link>
                                )}
                                {churchMember.church.homepage && (
                                    <Link
                                        href={churchMember.church.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-500 hover:text-primary transition-colors"
                                        title="Homepage"
                                    >
                                        <GlobeAltIcon className="w-6 h-6" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <FeedList feeds={feeds} userId={session.user.id} />
            </main>
        </div>
    );
}
