import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "./providers";
import { Suspense } from "react";
import Loading from "./loading";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const APP_NAME = "Gospel House";
const APP_DESCRIPTION = "교회 사역팀을 위한 커뮤니티 플랫폼";

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_NAME,
        template: "%s - Gospel House",
    },
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_NAME,
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    },
};

export const viewport: Viewport = {
    themeColor: "#FFFFFF",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <html lang="ko" dir="ltr">
            <head>
                <style>{`
            html, body, #__next {
              height: 100%;
            }
            #__next {
              margin: 0 auto;
            }
            h1 {
              text-align: center;
            }
            `}</style>
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <SessionProvider session={session}>
                    <Providers>
                        <Suspense fallback={<Loading />}>
                            <AppSidebar>{children}</AppSidebar>
                        </Suspense>
                    </Providers>
                </SessionProvider>
            </body>
        </html>
    );
}
