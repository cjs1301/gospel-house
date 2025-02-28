import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@heroui/react";
import { MusicalNoteIcon, BellIcon, UserGroupIcon } from "@heroicons/react/24/outline";
// import { useState, useEffect } from "react";
// function urlBase64ToUint8Array(base64String: string) {
//     const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//     const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

//     const rawData = window.atob(base64);
//     const outputArray = new Uint8Array(rawData.length);

//     for (let i = 0; i < rawData.length; ++i) {
//         outputArray[i] = rawData.charCodeAt(i);
//     }
//     return outputArray;
// }

// function InstallPrompt() {
//     const [isIOS, setIsIOS] = useState(false);
//     const [isStandalone, setIsStandalone] = useState(false);

//     useEffect(() => {
//         setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

//         setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
//     }, []);

//     if (isStandalone) {
//         return null; // Don't show install button if already installed
//     }

//     return (
//         <div>
//             <h3>Install App</h3>
//             <button>Add to Home Screen</button>
//             {isIOS && (
//                 <p>
//                     To install this app on your iOS device, tap the share button
//                     <span role="img" aria-label="share icon">
//                         {" "}
//                         ⎋{" "}
//                     </span>
//                     and then "Add to Home Screen"
//                     <span role="img" aria-label="plus icon">
//                         {" "}
//                         ➕{" "}
//                     </span>
//                     .
//                 </p>
//             )}
//         </div>
//     );
// }

export default async function Home() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }
    return (
        <div className="min-h-screen bg-background">
            {/* Main content - adjusted for left sidebar and mobile top bar */}
            <main className="md:pl-72 md:pt-0 pt-16 pb-16 md:pb-0">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold tracking-tight lg:text-6xl text-primary">
                            Gospel House
                        </h1>
                        <p className="mt-3 text-xl text-gray-500">
                            교회 사역팀을 위한 커뮤니티 플랫폼
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <MusicalNoteIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold">찬양팀</h3>
                                <p className="text-gray-500">
                                    매주 로테이션 체크 및 찬양 리스트 공유
                                </p>
                                <Button color="primary" className="w-full">
                                    바로가기
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <BellIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold">공지사항</h3>
                                <p className="text-gray-500">교회 사역팀별 공지사항 확인</p>
                                <Button color="primary" className="w-full">
                                    바로가기
                                </Button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                                    <UserGroupIcon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold">사역팀</h3>
                                <p className="text-gray-500">다양한 사역팀 정보 및 일정 확인</p>
                                <Button color="primary" className="w-full">
                                    바로가기
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
