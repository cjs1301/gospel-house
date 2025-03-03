"use client";

import { Card, CardBody, Skeleton } from "@heroui/react";

export default function HomeLoading() {
    // 임시 배열 생성 (4개의 스켈레톤 아이템을 표시)
    const skeletonItems = Array(4).fill(null);

    return (
        <div className="min-h-screen bg-background">
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* 헤더 카드 */}
                <Card className="mb-8 bg-gradient-to-r from-primary/10 via-background to-background">
                    <CardBody>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-lg" />
                                <div>
                                    <Skeleton className="h-7 w-48 rounded-lg mb-2" />
                                    <Skeleton className="h-4 w-64 rounded-lg mb-2" />
                                    <Skeleton className="h-3 w-32 rounded-lg" />
                                </div>
                            </div>

                            {/* 소셜 미디어 링크 스켈레톤 */}
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-6 h-6 rounded" />
                                <Skeleton className="w-6 h-6 rounded" />
                                <Skeleton className="w-6 h-6 rounded" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 피드 스켈레톤 */}
                <div className="space-y-6">
                    {skeletonItems.map((_, index) => (
                        <Card key={index} className="w-full">
                            <CardBody>
                                <div className="space-y-4">
                                    {/* 피드 헤더 */}
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <Skeleton className="h-4 w-32 rounded-lg mb-1" />
                                            <Skeleton className="h-3 w-24 rounded-lg" />
                                        </div>
                                    </div>
                                    {/* 피드 콘텐츠 */}
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                                    {/* 이미지 스켈레톤 */}
                                    <Skeleton className="h-64 w-full rounded-lg" />
                                    {/* 액션 버튼 */}
                                    <div className="flex gap-4">
                                        <Skeleton className="h-8 w-8 rounded" />
                                        <Skeleton className="h-8 w-8 rounded" />
                                    </div>
                                    {/* 좋아요 & 댓글 수 */}
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-16 rounded-lg" />
                                        <Skeleton className="h-4 w-16 rounded-lg" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
