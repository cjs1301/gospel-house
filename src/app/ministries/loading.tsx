import { Card, CardHeader, CardBody, Avatar, ScrollShadow } from "@heroui/react";
import { Skeleton } from "@heroui/react";

export default function MinistryLoading() {
    // 임시 배열 생성 (4개의 스켈레톤 아이템을 표시)
    const skeletonItems = Array(4).fill(null);

    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            {/* 사역팀 Avatar 스크롤 섹션 스켈레톤 */}
            <div className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 md:top-0">
                <ScrollShadow
                    orientation="horizontal"
                    className="flex gap-4 p-4 overflow-x-auto hide-scrollbar"
                >
                    {skeletonItems.map((_, index) => (
                        <div key={index} className="flex flex-col items-center gap-1 min-w-[64px]">
                            <Skeleton className="w-16 h-16 rounded-full" />
                            <Skeleton className="h-3 w-16 rounded-lg" />
                            <Skeleton className="h-2 w-8 rounded-lg" />
                        </div>
                    ))}
                </ScrollShadow>
            </div>

            {/* 사역팀 피드 섹션 스켈레톤 */}
            <main className="container max-w-2xl mx-auto px-4 pt-36 md:pt-28">
                <div className="space-y-6">
                    {skeletonItems.map((_, index) => (
                        <Card key={index} className="w-full">
                            <CardHeader className="flex gap-3">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-4 w-32 rounded-lg" />
                                    <Skeleton className="h-3 w-24 rounded-lg" />
                                </div>
                            </CardHeader>

                            <CardBody className="px-4 py-3">
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
