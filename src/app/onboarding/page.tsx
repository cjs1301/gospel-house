import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import OnboardingForm from "../../components/onboarding/OnboardingForm";

export default async function OnboardingPage() {
    const session = await auth();

    // // If not logged in, redirect to login
    if (!session) {
        redirect("/login");
    }

    // // If user already has a church, redirect to home
    // const existingChurch = await prisma.churchMember.findFirst({
    //     where: { userId: session.user.id },
    // });

    // if (existingChurch) {
    //     redirect("/");
    // }

    // Get list of churches for selection
    const churches = await prisma.church.findMany({
        select: {
            id: true,
            name: true,
            address: true,
        },
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        환영합니다! 🎉
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        시작하기 전에 몇 가지 기본 정보가 필요합니다
                    </p>
                </div>
                <div className="mt-12">
                    <div className="bg-white shadow rounded-lg">
                        <OnboardingForm churches={churches} userName={session.user.name || ""} />
                    </div>
                </div>
            </div>
        </div>
    );
}
