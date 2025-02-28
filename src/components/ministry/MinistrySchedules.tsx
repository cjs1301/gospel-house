"use client";

import { useState, useEffect } from "react";
import { getMinistrySchedules } from "@/lib/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface MinistrySchedule {
    id: string;
    date: string;
    position: string;
    status: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface MinistrySchedulesProps {
    ministryId: string;
}

export default function MinistrySchedules({ ministryId }: MinistrySchedulesProps) {
    const [schedules, setSchedules] = useState<MinistrySchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSchedules() {
            try {
                const data = await getMinistrySchedules(ministryId);
                setSchedules(data);
            } catch (err) {
                console.error(err);
                setError("일정을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchSchedules();
    }, [ministryId]);

    if (isLoading) {
        return <div className="p-4">로딩 중...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "text-green-600";
            case "REJECTED":
                return "text-red-600";
            default:
                return "text-yellow-600";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "승인됨";
            case "REJECTED":
                return "거절됨";
            default:
                return "대기 중";
        }
    };

    return (
        <div className="space-y-4">
            {schedules.map((schedule) => (
                <div
                    key={schedule.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold">
                                {format(new Date(schedule.date), "M월 d일 (E)", { locale: ko })}
                            </h3>
                            <p className="text-gray-600">{schedule.position}</p>
                        </div>
                        <span className={`text-sm font-medium ${getStatusColor(schedule.status)}`}>
                            {getStatusText(schedule.status)}
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        신청자: {schedule.user.name || "알 수 없음"}
                    </div>
                </div>
            ))}
            {schedules.length === 0 && (
                <div className="text-center text-gray-500 py-8">등록된 일정이 없습니다.</div>
            )}
        </div>
    );
}
