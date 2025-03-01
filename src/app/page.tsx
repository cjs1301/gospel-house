import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";
import FeedList from "@/components/FeedList";

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
                {/* 헤더 섹션 */}
                <div className="text-center md:text-left mb-12">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-6xl text-primary">
                        Gospel House
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        {churchMember.church.name}의 소식을 확인하세요
                    </p>
                </div>

                <FeedList feeds={feeds} userId={session.user.id} />
            </main>
        </div>
    );
}
