import { ScrollShadow } from "@heroui/react";
import { ReactNode } from "react";

interface MinistryLayoutProps {
    children: ReactNode;
    headerContent: ReactNode;
}

export function MinistryLayout({ children, headerContent }: MinistryLayoutProps) {
    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            {/* 사역팀 Avatar 스크롤 섹션 */}
            <div className="bg-background/95 backdrop-blur-sm">
                <ScrollShadow
                    orientation="horizontal"
                    className="flex gap-4 p-4 overflow-x-auto hide-scrollbar"
                >
                    {headerContent}
                </ScrollShadow>
            </div>

            {/* 사역팀 피드 섹션 */}
            <main className="container max-w-2xl mx-auto px-4 pt-2 md:pt-10">
                <div className="space-y-6">{children}</div>
            </main>
        </div>
    );
}
