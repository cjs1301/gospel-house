import Navigation from "@/components/Navigation";

export default async function WorshipPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900">찬양팀 일정</h1>
                                <p className="mt-2 text-sm text-gray-500">
                                    매달 로테이션 체크 및 찬양 리스트를 확인하세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
