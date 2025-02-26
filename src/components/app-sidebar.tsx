"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Home, Bell, Users, LogOut, LogIn, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AppSidebar({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const isLoading = status === "loading";
    const isLoginPage = pathname === "/login";

    // 데스크탑용 네비게이션 아이템 (알림 포함)
    const desktopNavigationItems = [
        { href: "/", label: "홈", icon: Home },
        { href: "/teams", label: "사역팀", icon: Users },
        { href: "/announcements", label: "공지사항", icon: ScrollText },
        { href: "/notifications", label: "알림", icon: Bell },
        {
            href: "/profile",
            label: "내 정보",
            icon: ({ className }: { className?: string }) => (
                <Avatar className={cn("h-6 w-6", className)}>
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                </Avatar>
            ),
        },
    ];

    // 모바일용 네비게이션 아이템 (알림 제외)
    const mobileNavigationItems = desktopNavigationItems.filter(
        (item) => item.href !== "/notifications"
    );

    if (isLoginPage) {
        return children;
    }

    return (
        <div className="min-h-screen">
            {/* Mobile - Top Navigation */}
            <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
                <Link href="/" className="text-xl font-bold text-primary">
                    Gospel House
                </Link>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/notifications">
                        <Bell className="h-6 w-6" />
                    </Link>
                </Button>
            </div>

            {/* Desktop - Left Sidebar */}
            <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
                <div className="flex flex-col flex-grow border-r bg-background">
                    <div className="flex h-16 items-center px-4 border-b">
                        <Link href="/" className="text-xl font-bold text-primary">
                            Gospel House
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <div className="flex-1 py-6 px-4">
                            <nav className="space-y-2">
                                {desktopNavigationItems.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-x-2 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                                pathname === item.href
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 border-t p-4">
                            {isLoading ? (
                                <div className="h-8 w-full bg-muted rounded animate-pulse" />
                            ) : session ? (
                                <div className="flex items-center w-full justify-between">
                                    <div className="flex items-center">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user?.image || ""} />
                                            <AvatarFallback>
                                                {session.user?.name?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="ml-3 text-sm font-medium text-muted-foreground">
                                            {session.user?.name}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </div>
                            ) : (
                                <Button className="w-full" onClick={() => signIn("kakao")}>
                                    <LogIn className="mr-2 h-5 w-5" />
                                    로그인
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="md:pl-72">
                <div className="pt-16 pb-16 md:pt-0 md:pb-0">{children}</div>
            </div>

            {/* Mobile - Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
                <nav className="flex items-center justify-around h-16 px-4">
                    {mobileNavigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-16",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "h-6 w-6",
                                        isActive && "scale-110 transition-transform"
                                    )}
                                />
                                <span className="text-xs mt-1">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
