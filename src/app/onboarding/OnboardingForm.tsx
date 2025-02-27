"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Input } from "@heroui/react";

interface Church {
    id: string;
    name: string;
    address: string | null;
}

interface Props {
    churches: Church[];
    userId: string;
    userEmail: string;
    userName: string;
}

export default function OnboardingForm({ churches, userId, userEmail, userName }: Props) {
    const router = useRouter();
    const { update: updateSession } = useSession();
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: userName,
        churchId: "",
        selectedChurchName: "",
    });

    const filteredChurches = churches.filter((church) =>
        church.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChurchSelect = (church: Church) => {
        setFormData((prev) => ({
            ...prev,
            churchId: church.id,
            selectedChurchName: church.name,
        }));
        setStep(2);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/church/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    churchId: formData.churchId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to complete onboarding");
            }

            await updateSession();
            router.refresh();
            router.push("/");
        } catch (error) {
            console.error("Error during onboarding:", error);
            alert("온보딩 과정에서 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                {step === 1 ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">소속 교회 선택</h2>
                        <div className="mb-4">
                            <Input
                                type="text"
                                placeholder="교회 이름으로 검색"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            {filteredChurches.map((church) => (
                                <Button
                                    key={church.id}
                                    color="default"
                                    onClick={() => handleChurchSelect(church)}
                                    className="w-full justify-start h-auto py-4 hover:bg-gray-100"
                                >
                                    <div className="text-left">
                                        <div className="font-medium">{church.name}</div>
                                        {church.address && (
                                            <div className="text-sm text-gray-500">
                                                {church.address}
                                            </div>
                                        )}
                                    </div>
                                </Button>
                            ))}
                            {filteredChurches.length === 0 && (
                                <div className="text-center text-gray-500 py-4">
                                    검색 결과가 없습니다
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold mb-4">정보 확인</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">이메일</label>
                                <div className="p-2 bg-gray-100 rounded-md">{userEmail}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">이름</label>
                                <Input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">선택한 교회</label>
                                <div className="p-2 bg-gray-100 rounded-md">
                                    {formData.selectedChurchName}
                                </div>
                            </div>
                            <div className="pt-4 flex justify-between">
                                <Button color="secondary" onClick={() => setStep(1)}>
                                    이전
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={handleSubmit}
                                    disabled={isLoading || !formData.name || !formData.churchId}
                                >
                                    {isLoading ? "처리 중..." : "완료"}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
