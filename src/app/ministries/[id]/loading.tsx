import { Card, CardHeader, CardBody, Button, Skeleton } from "@heroui/react";

export default function MinistryDetailLoading() {
    // 임시 배열 생성 (3개의 스켈레톤 아이템을 표시)
    const skeletonItems = Array(3).fill(null);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* 사역팀 헤더 스켈레톤 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Skeleton className="h-8 w-48 rounded-lg mb-4" />
                            <Skeleton className="h-4 w-full max-w-md rounded-lg mb-2" />
                            <Skeleton className="h-4 w-24 rounded-lg" />
                        </div>
                        <Skeleton className="h-10 w-24 rounded-lg" /> {/* 가입 버튼 */}
                    </div>
                </div>

                {/* 공지사항과 일정 섹션 스켈레톤 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 공지사항 섹션 */}
                    <div>
                        <Skeleton className="h-6 w-32 rounded-lg mb-4" />
                        <div className="space-y-4">
                            {skeletonItems.map((_, index) => (
                                <Card key={`notice-${index}`} className="w-full">
                                    <CardHeader className="flex gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full" />
                                        <div className="flex flex-col gap-2">
                                            <Skeleton className="h-4 w-32 rounded-lg" />
                                            <Skeleton className="h-3 w-24 rounded-lg" />
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="space-y-3">
                                            <Skeleton className="h-4 w-full rounded-lg" />
                                            <Skeleton className="h-4 w-3/4 rounded-lg" />
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* 일정 섹션 */}
                    <div>
                        <Skeleton className="h-6 w-32 rounded-lg mb-4" />
                        <div className="space-y-4">
                            {skeletonItems.map((_, index) => (
                                <Card key={`schedule-${index}`} className="w-full">
                                    <CardBody>
                                        <div className="space-y-3">
                                            <Skeleton className="h-4 w-32 rounded-lg" />
                                            <Skeleton className="h-4 w-full rounded-lg" />
                                            <Skeleton className="h-4 w-3/4 rounded-lg" />
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
