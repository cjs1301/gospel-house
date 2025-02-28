"use client";

import { useState, useEffect } from "react";
import { getMinistryNotices } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface MinistryNotice {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface MinistryNoticesProps {
    ministryId: string;
}

export default function MinistryNotices({ ministryId }: MinistryNoticesProps) {
    const [notices, setNotices] = useState<MinistryNotice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchNotices() {
            try {
                const data = await getMinistryNotices(ministryId);
                setNotices(data);
            } catch (err) {
                console.error(err);
                setError("공지사항을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchNotices();
    }, [ministryId]);

    if (isLoading) {
        return <div className="p-4">로딩 중...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-4">
            {notices.map((notice) => (
                <div
                    key={notice.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{notice.title}</h3>
                        <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(notice.createdAt), {
                                addSuffix: true,
                                locale: ko,
                            })}
                        </span>
                    </div>
                    <p className="text-gray-600 whitespace-pre-wrap">{notice.content}</p>
                    <div className="mt-4 text-sm text-gray-500">
                        작성자: {notice.user.name || "알 수 없음"}
                    </div>
                </div>
            ))}
            {notices.length === 0 && (
                <div className="text-center text-gray-500 py-8">등록된 공지사항이 없습니다.</div>
            )}
        </div>
    );
}
