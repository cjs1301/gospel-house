"use client";

import { useState } from "react";
import { Calendar, Button, Modal, Select, type DateValue } from "@heroui/react";

interface MinistryCalendarProps {
    ministryId: string;
    isMember: boolean;
}

// 임시 포지션 데이터 (나중에 DB에서 가져올 예정)
const POSITIONS = [
    { id: "vocal", name: "보컬" },
    { id: "guitar", name: "기타" },
    { id: "piano", name: "피아노" },
    { id: "drum", name: "드럼" },
    { id: "bass", name: "베이스" },
];

export default function MinistryCalendar({ ministryId, isMember }: MinistryCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<DateValue>();
    const [selectedPosition, setSelectedPosition] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDateSelect = (date: DateValue) => {
        if (!isMember) return;
        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedDate || !selectedPosition) return;

        try {
            const response = await fetch("/api/ministry/schedule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ministryId,
                    date: selectedDate.toString(),
                    position: selectedPosition,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save schedule");
            }

            // 성공 후 상태 초기화
            setSelectedDate(undefined);
            setSelectedPosition("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving schedule:", error);
            alert("일정 등록에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="space-y-4">
            <Calendar
                value={selectedDate}
                onChange={handleDateSelect}
                className="rounded-md border"
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="사역 포지션 선택"
            >
                <div className="space-y-4 py-4">
                    <Select
                        value={selectedPosition}
                        onChange={(e) => setSelectedPosition(e.target.value)}
                        placeholder="포지션을 선택하세요"
                    >
                        {POSITIONS.map((position) => (
                            <option key={position.id} value={position.id}>
                                {position.name}
                            </option>
                        ))}
                    </Select>
                    <Button
                        color="primary"
                        className="w-full"
                        disabled={!selectedPosition}
                        onClick={handleSubmit}
                    >
                        확인
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
