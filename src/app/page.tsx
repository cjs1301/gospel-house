import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Bell, Users } from "lucide-react";

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
                        <p className="mt-3 text-xl text-muted-foreground">
                            교회 사역팀을 위한 커뮤니티 플랫폼
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                    <Music className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <CardTitle>찬양팀</CardTitle>
                                <CardDescription>
                                    매주 로테이션 체크 및 찬양 리스트 공유
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <a href="/worship">바로가기</a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                    <Bell className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <CardTitle>공지사항</CardTitle>
                                <CardDescription>교회 사역팀별 공지사항 확인</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <a href="/announcements">바로가기</a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <CardTitle>사역팀</CardTitle>
                                <CardDescription>다양한 사역팀 정보 및 일정 확인</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild className="w-full">
                                    <a href="/teams">바로가기</a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
