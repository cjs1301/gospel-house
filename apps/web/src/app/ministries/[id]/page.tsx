"use client";

import { useParams, useRouter } from "next/navigation";
import MinistryNotices from "@/components/ministry/MinistryNotices";
// import MinistrySchedules from "@/components/ministry/MinistrySchedules";
import { Button, Card, CardBody, Tabs, Tab } from "@heroui/react";
import Link from "next/link";
import { BellIcon, CalendarIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import MinistryDetailLoading from "./loading";
import MinistryArchive from "@/components/ministry/MinistryArchive";
import { useSession } from "next-auth/react";
import type { Ministry } from "@/types/ministry";

export const dynamic = "force-dynamic";

export default function MinistryPage() {
    const router = useRouter();
    const [ministryData, setMinistryData] = useState<Ministry | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { data: session } = useSession();
    async function joinMinistry(ministryId: string) {
        if (!session) {
            router.push("/login");
        }

        try {
            const response = await fetch(`/api/ministries/${ministryId}/join`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to join ministry");
            }

            // Refresh the page to show updated membership status
            router.refresh();
        } catch (error) {
            console.error("Error joining ministry:", error);
            // 여기에 에러 처리 로직 추가 (예: 토스트 메시지)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/ministries/${id}`);
                if (!response.ok) {
                    throw new Error("Ministry not found");
                }
                const data = await response.json();
                setMinistryData(data);
            } catch (error) {
                console.error("Error fetching ministry data:", error);
                router.push("/ministries");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    if (loading || !ministryData) {
        return <MinistryDetailLoading />;
    }

    const isMember = ministryData.members.length > 0;
    const isLeader = ministryData.members.some((member) => member.role === "ADMIN");

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight text-primary">
                            {ministryData.name}
                        </h1>
                        {isLeader && (
                            <Link href={`/ministries/${ministryData.id}/manage`}>
                                <Button color="secondary">사역팀 관리</Button>
                            </Link>
                        )}
                        {!isMember && (
                            <form action={() => joinMinistry(ministryData.id)}>
                                <Button type="submit" color="primary">
                                    사역팀 가입
                                </Button>
                            </form>
                        )}
                    </div>
                    <p className="mt-2 text-gray-500">{ministryData.description}</p>
                    <p className="mt-1 text-sm text-gray-500">
                        멤버 {ministryData._count.members}명
                    </p>
                </div>

                <Card>
                    <CardBody>
                        <Tabs
                            aria-label="사역팀 정보"
                            color="primary"
                            variant="underlined"
                            classNames={{
                                tabList: "gap-6",
                                cursor: "w-full",
                                tab: "max-w-fit px-0 h-12",
                            }}
                        >
                            <Tab
                                key="notices"
                                title={
                                    <div className="flex items-center gap-2">
                                        <BellIcon className="h-4 w-4" />
                                        <span>공지사항</span>
                                    </div>
                                }
                            >
                                <div className="py-4">
                                    <MinistryNotices notices={ministryData.notices} />
                                </div>
                            </Tab>
                            <Tab
                                key="schedules"
                                title={
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>일정</span>
                                    </div>
                                }
                            >
                                <div className="py-4">
                                    {/* <MinistrySchedules
                                        schedules={ministryData.schedules}
                                        notices={ministryData.notices}
                                        positions={ministryData.positions}
                                        userMinistries={[ministryData.id]}
                                    /> */}
                                </div>
                            </Tab>
                            <Tab
                                key="archive"
                                title={
                                    <div className="flex items-center gap-2">
                                        <ArchiveBoxIcon className="h-4 w-4" />
                                        <span>아카이브</span>
                                    </div>
                                }
                            >
                                <div className="py-4">
                                    <MinistryArchive
                                        files={ministryData.files}
                                        isLeader={isLeader}
                                        ministryId={ministryData.id}
                                    />
                                </div>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
