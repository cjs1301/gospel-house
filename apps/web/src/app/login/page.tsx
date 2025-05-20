"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@heroui/react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleKakaoSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn("kakao", {
                redirectTo: "/",
            });
        } catch (error) {
            console.error("Login failed:", error);
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
                        color="default"
                        onPress={handleKakaoSignIn}
                        disabled={isLoading}
                        className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] hover:text-[#000000]/90"
                    >
                        {isLoading ? (
                            <>
                                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                                로딩 중...
                            </>
                        ) : (
                            <>
                                <Image
                                    src="/login/kakao-icon.png"
                                    alt="kakao"
                                    width={18}
                                    height={18}
                                />
                                카카오로 로그인
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
