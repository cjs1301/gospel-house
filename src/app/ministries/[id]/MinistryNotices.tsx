"use client";

import { useState } from "react";
import { Button, Modal, Input, Textarea } from "@heroui/react";

interface MinistryNoticesProps {
    ministryId: string;
    isMember: boolean;
}

export default function MinistryNotices({ ministryId, isMember }: MinistryNoticesProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async () => {
        if (!title || !content) return;

        try {
            const response = await fetch("/api/ministry/notices", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ministryId,
                    title,
                    content,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create notice");
            }

            // 성공 후 상태 초기화
            setTitle("");
            setContent("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating notice:", error);
            alert("공지사항 등록에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="space-y-4">
            {isMember && (
                <div className="flex justify-end">
                    <Button color="primary" onClick={() => setIsModalOpen(true)}>
                        공지사항 작성
                    </Button>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="공지사항 작성">
                <div className="space-y-4 py-4">
                    <Input
                        type="text"
                        placeholder="제목"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Textarea
                        placeholder="내용을 입력하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                    />
                    <Button
                        color="primary"
                        className="w-full"
                        disabled={!title || !content}
                        onClick={handleSubmit}
                    >
                        등록
                    </Button>
                </div>
            </Modal>

            {/* 공지사항 목록 - 나중에 서버 컴포넌트로 분리 */}
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold">3월 첫째주 찬양곡</h3>
                    <p className="text-gray-500 text-sm mt-1">2024-03-01</p>
                    <p className="mt-2">
                        1. 나의 기도하는 것보다
                        <br />
                        2. 주의 임재 앞에 잠잠해
                        <br />
                        3. 주님의 영광 나타나셨네
                    </p>
                </div>
            </div>
        </div>
    );
}
