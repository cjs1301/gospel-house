import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });

    // If the user is not logged in, redirect to the login page
    const isAuthPage = request.nextUrl.pathname.startsWith("/login");

    if (!token && !isAuthPage) {
        const url = new URL("/login", request.url);
        url.searchParams.set("callbackUrl", encodeURI(request.url));
        return NextResponse.redirect(url);
    }

    // If the user is logged in and trying to access login page, redirect to home
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|images/favicon/favicon.ico).*)"],
};
