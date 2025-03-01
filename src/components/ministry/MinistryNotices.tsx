"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { User } from "@heroui/react";
import { Divider } from "@heroui/divider";

interface MinistryNotice {
    id: string;
    title: string;
    content: string;
    eventDate: string | null;
    startTime: string | null;
    endTime: string | null;
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface MinistryNoticesProps {
    notices: MinistryNotice[];
}

export default function MinistryNotices({ notices }: MinistryNoticesProps) {
    return (
        <div className="space-y-4">
            {notices.map((notice) => (
                <Card key={notice.id} className="w-full">
                    <CardHeader className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{notice.title}</h3>
                            <span className="text-sm text-default-500">
                                {formatDistanceToNow(new Date(notice.createdAt), {
                                    addSuffix: true,
                                    locale: ko,
                                })}
                            </span>
                        </div>
                        <Divider className="my-2" />
                    </CardHeader>
                    <CardBody className="pt-2">
                        <p className="text-default-600 whitespace-pre-wrap mb-4">
                            {notice.content}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                            <User
                                name={notice.user.name || "알 수 없음"}
                                description="작성자"
                                avatarProps={{
                                    src: notice.user.image || undefined,
                                    size: "sm",
                                    radius: "full",
                                }}
                                classNames={{
                                    base: "min-w-fit",
                                    description: "text-tiny text-default-500",
                                    name: "text-sm",
                                }}
                            />
                        </div>
                    </CardBody>
                </Card>
            ))}
            {notices.length === 0 && (
                <Card>
                    <CardBody>
                        <div className="text-center text-default-500 py-8">
                            등록된 공지사항이 없습니다.
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}
