import { ScrollShadow } from "@heroui/react";
import { ReactNode } from "react";

interface AnnouncementLayoutProps {
    children: ReactNode;
    headerContent: ReactNode;
}

export function AnnouncementLayout({ children, headerContent }: AnnouncementLayoutProps) {
    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            {/* 카테고리 필터 */}
            <div className="bg-background/95 backdrop-blur-sm">
                <ScrollShadow
                    orientation="horizontal"
                    className="flex gap-2 p-4 overflow-x-auto hide-scrollbar"
                >
                    {headerContent}
                </ScrollShadow>
            </div>

            {/* 공지사항 피드 */}
            <main className="container max-w-2xl mx-auto px-4 pt-2 md:pt-10">
                <div className="space-y-4">{children}</div>
            </main>
        </div>
    );
}
