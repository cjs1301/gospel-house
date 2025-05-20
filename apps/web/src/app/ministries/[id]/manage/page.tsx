"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardBody, Tabs, Tab, Button } from "@heroui/react";
import {
    UserGroupIcon,
    CalendarIcon,
    BellIcon,
    Cog6ToothIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function MinistryManagePage() {
    const router = useRouter();
    const { id } = useParams();
    console.log(id);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* 헤더 */}
                <div className="flex items-center gap-4 mb-8">
                    <Button
                        variant="light"
                        isIconOnly
                        onPress={() => router.back()}
                        className="hidden sm:flex"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-primary">
                            사역팀 관리
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            사역팀의 멤버, 일정, 공지사항을 관리합니다
                        </p>
                    </div>
                </div>

                {/* 관리 탭 */}
                <Card className="w-full">
                    <CardBody>
                        <Tabs
                            aria-label="사역팀 관리"
                            color="primary"
                            variant="underlined"
                            classNames={{
                                tabList: "gap-6",
                                cursor: "w-full",
                                tab: "max-w-fit px-0 h-12",
                            }}
                        >
                            <Tab
                                key="members"
                                title={
                                    <div className="flex items-center gap-2">
                                        <UserGroupIcon className="h-4 w-4" />
                                        <span>멤버 관리</span>
                                    </div>
                                }
                            >
                                <div className="py-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">멤버 목록</h3>
                                        <Button color="primary" size="sm">
                                            포지션 관리
                                        </Button>
                                    </div>
                                    {/* 멤버 관리 컴포넌트 */}
                                </div>
                            </Tab>

                            <Tab
                                key="schedules"
                                title={
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>일정 관리</span>
                                    </div>
                                }
                            >
                                <div className="py-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">일정 관리</h3>
                                        <Button color="primary" size="sm">
                                            일정 추가
                                        </Button>
                                    </div>
                                    {/* 일정 관리 컴포넌트 */}
                                </div>
                            </Tab>

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
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">공지사항 관리</h3>
                                        <Button color="primary" size="sm">
                                            공지 작성
                                        </Button>
                                    </div>
                                    {/* 공지사항 관리 컴포넌트 */}
                                </div>
                            </Tab>

                            <Tab
                                key="settings"
                                title={
                                    <div className="flex items-center gap-2">
                                        <Cog6ToothIcon className="h-4 w-4" />
                                        <span>설정</span>
                                    </div>
                                }
                            >
                                <div className="py-4">
                                    <h3 className="text-lg font-semibold mb-4">사역팀 설정</h3>
                                    {/* 설정 컴포넌트 */}
                                </div>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
