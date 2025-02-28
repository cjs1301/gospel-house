import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import MinistryGrid from "./MinistryGrid";

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
        },
    });
    console.log(ministries);

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center md:text-left mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">사역팀 목록</h1>
                    <p className="mt-2 text-gray-500">
                        {churchMember.church.name}의 모든 사역팀을 확인하세요
                    </p>
                </div>
                <MinistryGrid ministries={ministries} />
            </main>
        </div>
    );
}
