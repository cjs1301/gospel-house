"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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

            // Update the session to reflect the new church selection
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
            <Card>
                <CardContent className="pt-6">
                    {step === 1 ? (
                        <>
                            <h2 className="text-xl font-semibold mb-4">소속 교회 선택</h2>
                            <div className="mb-4">
                                <Input
                                    type="text"
                                    placeholder="교회 이름으로 검색"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                {filteredChurches.map((church) => (
                                    <Button
                                        key={church.id}
                                        variant="outline"
                                        onClick={() => handleChurchSelect(church)}
                                        className="w-full justify-start h-auto py-4"
                                    >
                                        <div className="text-left">
                                            <div className="font-medium">{church.name}</div>
                                            {church.address && (
                                                <div className="text-sm text-muted-foreground">
                                                    {church.address}
                                                </div>
                                            )}
                                        </div>
                                    </Button>
                                ))}
                                {filteredChurches.length === 0 && (
                                    <div className="text-center text-muted-foreground py-4">
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
                                    <Label>이메일</Label>
                                    <div className="p-2 bg-muted rounded-md">{userEmail}</div>
                                </div>
                                <div className="space-y-2">
                                    <Label>이름</Label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>선택한 교회</Label>
                                    <div className="p-2 bg-muted rounded-md">
                                        {formData.selectedChurchName}
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-between">
                                    <Button variant="outline" onClick={() => setStep(1)}>
                                        이전
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading || !formData.name || !formData.churchId}
                                    >
                                        {isLoading ? "처리 중..." : "완료"}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
