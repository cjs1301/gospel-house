"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Gospel House 로그인</CardTitle>
                    <CardDescription className="text-center">
                        교회 커뮤니티 플랫폼에 오신 것을 환영합니다
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        variant="outline"
                        onClick={handleKakaoSignIn}
                        disabled={isLoading}
                        className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] hover:text-[#000000]/90"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                </CardContent>
            </Card>
        </div>
    );
}
