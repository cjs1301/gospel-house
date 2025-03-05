import { Button } from "@heroui/react";
import { useState } from "react";

interface MinistryPosition {
    id: string;
    name: string;
    description: string | null;
    maxMembers: number | null;
    ministryId: string;
}

interface ScheduleApplicationProps {
    ministryId: string;
    positions: MinistryPosition[];
    selectedDate: Date;
}

export function ScheduleApplication({
    ministryId,
    positions,
    selectedDate,
}: ScheduleApplicationProps) {
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

    const handleApply = async (positionId: string) => {
        try {
            setIsSubmitting(positionId);
            const response = await fetch(`/api/ministries/${ministryId}/schedules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ministryId,
                    positionId, // position 대신 positionId 사용
                    date: selectedDate,
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            // 성공 시 새로고침
            window.location.reload();
        } catch (error) {
            console.error("Error applying for schedule:", error);
            alert("일정 신청 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(null);
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">사역 신청</h3>

            <div className="grid gap-4">
                {positions.map((position) => (
                    <div
                        key={position.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                        <div>
                            <h4 className="font-medium">{position.name}</h4>
                            {position.maxMembers && (
                                <p className="text-sm text-gray-600">
                                    최대 {position.maxMembers}명
                                </p>
                            )}
                        </div>

                        <Button
                            color="primary"
                            variant="flat"
                            isLoading={isSubmitting === position.id}
                            onPress={() => handleApply(position.id)}
                        >
                            신청하기
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
