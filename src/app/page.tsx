import Navigation from "@/components/Navigation";

export default async function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Gospel House
                        </h1>
                        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                            교회 사역팀을 위한 커뮤니티 플랫폼
                        </p>
                    </div>

                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="pt-6">
                                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            찬양팀
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            매주 로테이션 체크 및 찬양 리스트 공유
                                        </p>
                                        <div className="mt-6">
                                            <a
                                                href="/worship"
                                                className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                바로가기
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            공지사항
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            교회 사역팀별 공지사항 확인
                                        </p>
                                        <div className="mt-6">
                                            <a
                                                href="/announcements"
                                                className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                바로가기
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md">
                                    <div className="-mt-6">
                                        <div>
                                            <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                                                <svg
                                                    className="h-6 w-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                                            사역팀
                                        </h3>
                                        <p className="mt-5 text-base text-gray-500">
                                            다양한 사역팀 정보 및 일정 확인
                                        </p>
                                        <div className="mt-6">
                                            <a
                                                href="/teams"
                                                className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                바로가기
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
