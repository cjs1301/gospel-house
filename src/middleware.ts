import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: Request) {
    const session = await auth();
    const { pathname } = new URL(request.url);

    // 1. 공개 페이지 (로그인하지 않아도 접근 가능)
    const publicPages = ["/login"];
    if (publicPages.includes(pathname)) {
        // 이미 로그인한 사용자는 홈으로
        if (session) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // 2. 온보딩 페이지
    if (pathname === "/onboarding") {
        // 로그인하지 않은 경우 로그인 페이지로
        if (!session) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        // 이미 교회를 선택한 경우 홈으로
        if (session.user.hasChurch) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    // 3. 보호된 페이지 (로그인 필요)
    // 로그인하지 않은 경우
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 교회를 선택하지 않은 경우 (온보딩 필요)
    if (!session.user.hasChurch && pathname !== "/onboarding") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
    matcher: [
        // 미들웨어를 적용할 경로
        "/",
        "/login",
        "/onboarding",
        "/teams/:path*",
        "/announcements/:path*",
        "/notifications/:path*",
        "/profile/:path*",
        // 미들웨어를 적용하지 않을 경로
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
