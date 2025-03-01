"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, Input, Form } from "@heroui/react";
import { z } from "zod";

interface Church {
    id: string;
    name: string;
    address: string | null;
}

interface Props {
    churches: Church[];
    userName: string;
}

const onboardingSchema = z.object({
    name: z.string().min(2, "이름은 2글자 이상이어야 합니다."),
    churchId: z.string().min(1, "교회를 선택해주세요."),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingForm({ churches, userName }: Props) {
    const router = useRouter();
    const { update: updateSession } = useSession();
    const [step, setStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedChurchName, setSelectedChurchName] = useState("");
    const [formData, setFormData] = useState<OnboardingFormData>({
        name: userName,
        churchId: "",
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const filteredChurches = churches.filter((church) =>
        church.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChurchSelect = (church: Church) => {
        setFormData((prev) => ({
            ...prev,
            churchId: church.id,
        }));
        setSelectedChurchName(church.name);
        setValidationErrors({});
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors: Record<string, string> = {};

        if (!formData.name || formData.name.length < 2) {
            errors.name = "이름은 2글자 이상이어야 합니다.";
        }
        if (!formData.churchId) {
            errors.churchId = "교회를 선택해주세요.";
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch("/api/church/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to complete onboarding");
            }

            await updateSession();
            router.refresh();
            router.push("/");
        } catch (error) {
            console.error("Error during onboarding:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "온보딩 과정에서 오류가 발생했습니다. 다시 시도해주세요."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <Form
                    validationBehavior="aria"
                    validationErrors={validationErrors}
                    onSubmit={handleSubmit}
                >
                    {step === 1 ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4">소속 교회 선택</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">교회 검색</label>
                                <Input
                                    type="text"
                                    placeholder="교회 이름으로 검색"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                                {validationErrors.churchId && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {validationErrors.churchId}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                {filteredChurches.map((church) => (
                                    <Button
                                        key={church.id}
                                        type="button"
                                        color="default"
                                        onPress={() => handleChurchSelect(church)}
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
                                <div>
                                    <label className="block text-sm font-medium mb-2">이름</label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="w-full"
                                    />
                                    {validationErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {validationErrors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        선택한 교회
                                    </label>
                                    <div className="p-2 bg-gray-100 rounded-md">
                                        {selectedChurchName}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-between">
                                    <Button
                                        type="button"
                                        color="secondary"
                                        onPress={() => setStep(1)}
                                    >
                                        이전
                                    </Button>
                                    <Button type="submit" color="primary" disabled={isLoading}>
                                        {isLoading ? "처리 중..." : "완료"}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}
