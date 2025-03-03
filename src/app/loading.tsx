"use client";

import { Card, CardHeader, CardBody, ScrollShadow, Skeleton } from "@heroui/react";

export default function HomeLoading() {
    // 임시 배열 생성 (4개의 스켈레톤 아이템을 표시)
    const skeletonItems = Array(4).fill(null);

    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            {/* 교회 정보 스켈레톤 */}
            <div className="container max-w-4xl mx-auto px-4 pt-8">
                <Card className="w-full mb-8">
                    <CardHeader className="flex gap-3">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex flex-col gap-2 flex-1">
                            <Skeleton className="h-6 w-48 rounded-lg" />
                            <Skeleton className="h-4 w-32 rounded-lg" />
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4 rounded-lg" />
                            <div className="flex gap-4 mt-6">
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <Skeleton className="h-10 w-10 rounded-lg" />
                                <Skeleton className="h-10 w-10 rounded-lg" />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 공지사항 스켈레톤 */}
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
                            <CardBody>
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                                    <Skeleton className="h-4 w-1/2 rounded-lg" />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
