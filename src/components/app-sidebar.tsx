"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import {
    HomeIcon,
    BellIcon,
    UserGroupIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@heroui/react";
import { Avatar, User } from "@heroui/react";

// Utility function to combine class names
const cn = (...classes: (string | undefined | boolean)[]) => classes.filter(Boolean).join(" ");

export function AppSidebar({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const isLoading = status === "loading";
    const isLoginPage = pathname === "/login";

    // 데스크탑용 네비게이션 아이템 (알림 포함)
    const desktopNavigationItems = [
        { href: "/", label: "홈", icon: HomeIcon },
        { href: "/ministries", label: "사역팀", icon: UserGroupIcon },
        { href: "/announcements", label: "공지사항", icon: DocumentTextIcon },
        { href: "/notifications", label: "알림", icon: BellIcon },
        {
            href: "/profile",
            label: "내 정보",
            icon: ({ className }: { className?: string }) => (
                <Avatar
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || ""}
                    className={cn("h-6 w-6", className)}
                />
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
                <Link href="/notifications" className="p-2">
                    <BellIcon className="h-6 w-6" />
                </Link>
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
                                                    ? "bg-primary text-white"
                                                    : "text-gray-500 hover:bg-gray-100"
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
                                <div className="h-8 w-full bg-gray-100 rounded animate-pulse" />
                            ) : session ? (
                                <div className="flex items-center w-full justify-between">
                                    <User
                                        name={session.user?.name || ""}
                                        description={session.user?.email || ""}
                                        avatarProps={{
                                            src: session.user?.image || "",
                                            alt: session.user?.name || "",
                                            size: "sm",
                                        }}
                                        classNames={{
                                            base: "flex-1",
                                            wrapper: "truncate",
                                            name: "text-sm font-medium text-gray-700",
                                            description: "text-xs text-gray-500",
                                        }}
                                    />
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="p-2 hover:bg-gray-100 rounded-md ml-2"
                                    >
                                        <ArrowRightIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <Button
                                    color="primary"
                                    className="w-full"
                                    onPress={() => signIn("kakao")}
                                >
                                    <ArrowLeftIcon className="mr-2 h-5 w-5" />
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
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t shadow-sm md:hidden z-100">
                <nav className="flex items-center justify-around h-16 px-4">
                    {mobileNavigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch={true}
                                className={cn(
                                    "flex flex-col items-center justify-center w-16",
                                    isActive ? "text-primary" : "text-gray-500"
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
