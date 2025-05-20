"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Button, Divider, User, Tabs, Tab } from "@heroui/react";
import { PencilIcon, BellIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import LogoutButton from "@/components/profile/LogoutButton";

interface ProfileData {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
    ministries: {
        id: string;
        name: string;
        role: string;
        isLeader: boolean;
    }[];
}

// 서버 액션을 여기서 직접 정의
async function getProfileData(): Promise<ProfileData | null> {
    const response = await fetch("/api/profile");
    if (!response.ok) return null;
    return response.json();
}

export default function ProfilePage() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfileData().then((data) => {
            setProfileData(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!profileData) {
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
                            name={profileData.user.name}
                            description={profileData.user.email}
                            avatarProps={{
                                src: profileData.user.image || "",
                                alt: profileData.user.name || "",
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
                            <LogoutButton />
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
                                        <p className="mt-1">{profileData.user.name}</p>
                                    </div>
                                    <Divider />
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500">
                                            이메일
                                        </h4>
                                        <p className="mt-1">{profileData.user.email}</p>
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
                                    {profileData.ministries.length > 0 ? (
                                        <div className="space-y-4">
                                            {profileData.ministries.map((ministry) => (
                                                <Card key={ministry.id} className="p-4">
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <h4 className="font-semibold">
                                                                {ministry.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500">
                                                                {ministry.role}
                                                            </p>
                                                        </div>
                                                        {ministry.isLeader && (
                                                            <Link
                                                                href={`/ministries/${ministry.id}/manage`}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="light"
                                                                    color="primary"
                                                                >
                                                                    관리
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">참여중인 사역팀이 없습니다.</p>
                                    )}
                                </div>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
