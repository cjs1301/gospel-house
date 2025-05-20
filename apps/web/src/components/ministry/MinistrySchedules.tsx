"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar } from "@heroui/calendar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { User } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { Chip } from "@heroui/chip";
import { useState } from "react";
import { ScheduleApplication } from "./ScheduleApplication";
import type { MinistrySchedule, MinistryPosition, MinistryNotice } from "@/types/ministry";

interface MinistrySchedulesProps {
    schedules: MinistrySchedule[];
    notices: MinistryNotice[];
    positions: MinistryPosition[];
    userMinistries: string[];
}

export default function MinistrySchedules({
    schedules,
    notices,
    positions,
    userMinistries,
}: MinistrySchedulesProps) {
    const [selectedDate, setSelectedDate] = useState(today(getLocalTimeZone()));

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

    // 선택된 날짜의 일정과 공지들
    const selectedDateSchedules = schedules.filter(
        (schedule) =>
            format(new Date(schedule.date), "yyyy-MM-dd") ===
            format(selectedDate.toDate(getLocalTimeZone()), "yyyy-MM-dd")
    );

    const selectedDateNotices = notices.filter((notice) =>
        notice.events.some(
            (event) =>
                format(new Date(event.eventDate), "yyyy-MM-dd") ===
                format(selectedDate.toDate(getLocalTimeZone()), "yyyy-MM-dd")
        )
    );
    // 선택된 날짜가 일요일인지 확인
    const isSunday = selectedDate.toDate(getLocalTimeZone()).getDay() === 0;

    // 사용자가 해당 사역팀에 속해있는지 확인
    const ministryId = userMinistries[0];
    const isUserMember = userMinistries.includes(ministryId);

    return (
        <div className="space-y-6">
            <Card className="w-full">
                <CardBody className="items-center">
                    <Calendar
                        value={selectedDate}
                        onChange={setSelectedDate}
                        calendarWidth={300}
                        minValue={today(getLocalTimeZone())}
                        // className="[&_button]:transition-colors [&_button]:duration-200 [&_button.selected]:bg-primary-500 [&_button.selected]:text-white"
                    />
                </CardBody>
            </Card>
            {/* 일요일이고 사용자가 사역팀 멤버일 때만 신청 컴포넌트 표시 */}
            {isSunday && isUserMember && (
                <ScheduleApplication
                    ministryId={ministryId}
                    positions={positions}
                    selectedDate={selectedDate.toDate(getLocalTimeZone())}
                />
            )}

            {/* 선택된 날짜의 일정과 공지 목록 */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                    {format(selectedDate.toDate(getLocalTimeZone()), "M월 d일 (E)", { locale: ko })}{" "}
                    일정
                </h3>

                {/* 공지사항 섹션 */}
                {selectedDateNotices.length > 0 && (
                    <div className="space-y-4">
                        {selectedDateNotices.map((notice) => (
                            <Card key={notice.id} className="w-full">
                                <CardHeader className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Chip color="warning" variant="flat" size="sm">
                                                공지
                                            </Chip>
                                            <h4 className="text-lg font-semibold">
                                                {notice.title}
                                            </h4>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <p className="text-gray-600 whitespace-pre-wrap mb-4">
                                        {notice.content}
                                    </p>
                                    {notice.events[0] && (
                                        <p className="text-sm text-gray-500">
                                            시간:{" "}
                                            {format(
                                                new Date(notice.events[0].startTime),
                                                "a h:mm",
                                                {
                                                    locale: ko,
                                                }
                                            )}{" "}
                                            ~{" "}
                                            {format(new Date(notice.events[0].endTime), "a h:mm", {
                                                locale: ko,
                                            })}
                                        </p>
                                    )}
                                    <div className="mt-4">
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
                    </div>
                )}

                {/* 일정 섹션 */}
                {selectedDateSchedules.length > 0 && (
                    <div className="space-y-4">
                        {selectedDateSchedules.map((schedule) => (
                            <Card key={schedule.id} className="w-full">
                                <CardBody>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Chip color="primary" variant="flat" size="sm">
                                                일정
                                            </Chip>
                                            <div>
                                                <h4 className="font-medium">
                                                    {schedule.position.name}
                                                </h4>
                                                {schedule.position.maxMembers !== null && (
                                                    <p className="text-sm text-gray-600">
                                                        최대 {schedule.position.maxMembers}명
                                                    </p>
                                                )}
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${getStatusColor(
                                                    schedule.status
                                                )}`}
                                            >
                                                {getStatusText(schedule.status)}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <User
                                                name={schedule.user.name || "알 수 없음"}
                                                avatarProps={{
                                                    src: schedule.user.image || undefined,
                                                    size: "sm",
                                                    radius: "full",
                                                }}
                                                classNames={{
                                                    base: "min-w-fit",
                                                    name: "text-sm",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}

                {selectedDateSchedules.length === 0 && selectedDateNotices.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                        선택한 날짜에 등록된 일정이 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
