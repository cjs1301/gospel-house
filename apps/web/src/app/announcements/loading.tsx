import { Card, CardHeader, CardBody, CardFooter, Skeleton } from "@heroui/react";
import { AnnouncementLayout } from "@/components/layouts/AnnouncementLayout";

export default function AnnouncementLoading() {
    // 임시 배열 생성 (4개의 스켈레톤 아이템을 표시)
    const skeletonItems = Array(4).fill(null);
    const categories = Array(6).fill(null); // 카테고리 개수만큼

    const headerContent = categories.map((_, index) => (
        <Skeleton key={index} className="h-8 w-16 rounded-lg" />
    ));

    const mainContent = (
        <>
            {/* 관리자 버튼 스켈레톤 */}
            <div className="mb-6">
                <Skeleton className="h-9 w-32 rounded-lg" />
            </div>

            {/* 공지사항 카드 스켈레톤 */}
            {skeletonItems.map((_, index) => (
                <Card key={index} className="w-full">
                    <CardHeader className="flex gap-3 z-0">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-24 rounded-lg" />
                                <Skeleton className="h-5 w-16 rounded-lg" />
                            </div>
                            <Skeleton className="h-3 w-32 rounded-lg" />
                        </div>
                    </CardHeader>

                    <CardBody className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-3">
                            <Skeleton className="w-5 h-5 rounded" />
                            <Skeleton className="h-6 w-48 rounded-lg" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full rounded-lg" />
                            <Skeleton className="h-4 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4 rounded-lg" />
                        </div>
                    </CardBody>

                    <CardFooter className="px-4 pt-2 pb-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-16 rounded-lg" />
                            <div className="flex items-center gap-2 ml-2">
                                <Skeleton className="w-4 h-4 rounded" />
                                <Skeleton className="h-4 w-16 rounded-lg" />
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </>
    );

    return <AnnouncementLayout headerContent={headerContent}>{mainContent}</AnnouncementLayout>;
}
