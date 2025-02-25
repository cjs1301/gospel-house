"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navigation() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const isLoading = status === "loading";
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path
            ? "border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-indigo-600">
                                Gospel House
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Icon when menu is closed */}
                            <svg
                                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            {/* Icon when menu is open */}
                            <svg
                                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/" className={isActive("/")}>
                                홈
                            </Link>
                            <Link href="/worship" className={isActive("/worship")}>
                                찬양팀
                            </Link>
                            <Link href="/announcements" className={isActive("/announcements")}>
                                공지사항
                            </Link>
                        </div>

                        <div className="ml-6">
                            {isLoading ? (
                                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                            ) : session ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        {session.user?.name}
                                    </span>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        로그아웃
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => signIn("google")}
                                    className="bg-indigo-600 border border-transparent rounded-md py-1.5 px-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    로그인
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        href="/"
                        className={
                            pathname === "/"
                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        }
                    >
                        홈
                    </Link>
                    <Link
                        href="/worship"
                        className={
                            pathname === "/worship"
                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        }
                    >
                        찬양팀
                    </Link>
                    <Link
                        href="/announcements"
                        className={
                            pathname === "/announcements"
                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        }
                    >
                        공지사항
                    </Link>
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="flex items-center px-4">
                        {isLoading ? (
                            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                        ) : session ? (
                            <div className="flex flex-col">
                                <div className="text-base font-medium text-gray-800">
                                    {session.user?.name}
                                </div>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="mt-2 bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    로그아웃
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => signIn("google")}
                                className="bg-indigo-600 border border-transparent rounded-md py-1.5 px-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                로그인
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
