"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardHeader, CardBody, Button, Divider, User, Tabs, Tab } from "@heroui/react";
import { PencilIcon, BellIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function ProfilePage() {
    const { data: session } = useSession();

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    if (!session) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Card className="max-w-md p-6">
                    <CardBody>
                        <div className="text-center">
                            <p className="text-lg font-semibold">로그인이 필요합니다</p>
                            <p className="text-sm text-gray-500 mt-2">
                                프로필을 보려면 먼저 로그인해주세요.
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-6 md:grid-cols-3">
                {/* 프로필 카드 */}
                <Card className="p-4 md:col-span-1">
                    <CardBody className="flex flex-col items-center gap-3">
                        <User
                            name={session.user?.name}
                            description={session.user?.email}
                            avatarProps={{
                                src: session.user?.image || "",
                                alt: session.user?.name || "",
                                size: "lg",
                                className: "w-16 h-16",
                            }}
                            classNames={{
                                name: "text-lg font-semibold",
                                description: "text-sm text-gray-500",
                                wrapper: "items-center",
                            }}
                        />
                        <Divider className="w-full my-4" />
                        <div className="w-full space-y-4">
                            <Button
                                variant="light"
                                startContent={<PencilIcon className="h-4 w-4" />}
                                className="w-full justify-start"
                            >
                                프로필 수정
                            </Button>
                            <Button
                                variant="light"
                                startContent={<BellIcon className="h-4 w-4" />}
                                className="w-full justify-start"
                            >
                                알림 설정
                            </Button>
                            <Button
                                variant="light"
                                color="danger"
                                startContent={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                                className="w-full justify-start"
                                onPress={handleLogout}
                            >
                                로그아웃
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* 상세 정보 */}
                <Card className="p-4 md:col-span-2">
                    <CardBody>
                        <Tabs
                            aria-label="프로필 탭"
                            color="primary"
                            variant="underlined"
                            classNames={{
                                tabList: "gap-6",
                                cursor: "w-full",
                                tab: "max-w-fit px-0 h-12",
                            }}
                        >
                            <Tab key="info" title="기본 정보">
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">이름</h4>
                                        <p className="mt-1">{session.user?.name}</p>
                                    </div>
                                    <Divider />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                            이메일
                                        </h4>
                                        <p className="mt-1">{session.user?.email}</p>
                                    </div>
                                    <Divider />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                            가입일
                                        </h4>
                                        <p className="mt-1">
                                            {new Date().toLocaleDateString("ko-KR", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </Tab>
                            <Tab key="ministry" title="사역팀">
                                <div className="mt-4">
                                    <p className="text-gray-500">참여중인 사역팀이 없습니다.</p>
                                </div>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
