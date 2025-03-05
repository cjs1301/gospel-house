import { Card, CardHeader, CardBody, Skeleton } from "@heroui/react";
import { MinistryLayout } from "@/components/layouts/MinistryLayout";

export default function MinistryLoading() {
    // 임시 배열 생성 (4개의 스켈레톤 아이템을 표시)
    const skeletonItems = Array(4).fill(null);

    const headerContent = skeletonItems.map((_, index) => (
        <div key={index} className="flex flex-col items-center gap-1 min-w-[64px]">
            <Skeleton className="w-16 h-16 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-lg" />
            <Skeleton className="h-2 w-8 rounded-lg" />
        </div>
    ));

    const mainContent = skeletonItems.map((_, index) => (
        <Card key={index} className="w-full">
            <CardHeader className="flex gap-3 z-0">
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
    ));

    return <MinistryLayout headerContent={headerContent}>{mainContent}</MinistryLayout>;
}
