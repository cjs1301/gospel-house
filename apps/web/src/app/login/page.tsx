"use client";

import { Button } from "@heroui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
// import { useRouter } from "next/navigation";

// function KakaoLogo({ className }: { className?: string }) {
//     return (
//         <svg
//             width="48"
//             height="48"
//             viewBox="0 0 48 48"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             className={className}
//         >
//             <path
//                 fill="#000000"
//                 d="M24 4.5C28.5 4.5 32.5 5.3 36 6.9C39.5 8.5 42.2 10.7 44.1 13.4C46 16.1 47 19.1 47 22.4C47 25.7 46 28.7 44.1 31.4C42.2 34.1 39.5 36.3 36 37.9C32.5 39.5 28.5 40.3 24 40.3C23 40.3 21.9 40.2 20.8 40.1C14.5 44.1 10.9 46.2 10.4 46.3C10.1 46.4 9.9 46.4 9.8 46.3C9.7 46.2 9.6 46.1 9.6 46C9.5 45.9 9.5 45.8 9.5 45.7V45.6C9.6 44.9 10.5 42.3 12.2 37.5C8.8 35.9 6.2 33.8 4.3 31.1C2.4 28.4 1.4 25.4 1.4 22.4C1.4 19.1 2.4 16.1 4.3 13.4C6.2 10.7 8.9 8.5 12.4 6.9C15.9 5.3 19.9 4.5 24 4.5Z"
//             />
//         </svg>
//     );
// }

function GoogleLogo({ className }: { className?: string }) {
    return (
        <svg
            width="800px"
            height="800px"
            viewBox="0 0 32 32"
            data-name="Layer 1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
                fill="#00ac47"
            />
            <path
                d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
                fill="#4285f4"
            />
            <path
                d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
                fill="#ffba00"
            />
            <polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374" />
            <path
                d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
                fill="#ea4435"
            />
            <polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626" />
            <path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4" />
        </svg>
    );
}

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    // const router = useRouter();
    const handleKakaoLogin = async () => {
        try {
            setIsLoading(true);

            // 카카오 로그인 시도
            await signIn("google", {
                redirectTo: "/",
            });
            // router.push("/");
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-1 mb-6">
                    <h2 className="text-2xl font-semibold text-center">Gospel House 로그인</h2>
                    <p className="text-gray-500 text-center">교회 공동체를 위한 플랫폼</p>
                </div>
                <div className="space-y-4">
                    <Button
                        type="button"
                        isLoading={isLoading}
                        onPress={handleKakaoLogin}
                        className={`relative inline-flex items-center w-full h-14 px-[18px] rounded-[10px] text-base font-semibold cursor-pointer border-[1px] border-solid border-[#525252] bg-white text-black"`}
                        isDisabled={isLoading}
                    >
                        {/* <KakaoLogo className="w-6 h-6" /> */}
                        <GoogleLogo className="w-6 h-6" />
                        <span className="w-full text-center">
                            {isLoading ? "로그인 중..." : "구글로 로그인"}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
