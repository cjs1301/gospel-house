"use client";

import { useSession } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Avatar,
    Chip,
    ScrollShadow,
} from "@heroui/react";
import { PlusIcon, CalendarIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

type Category = "전체" | "모집" | "예배" | "셀모임" | "행사" | "기타";

type Announcement = {
    id: number;
    title: string;
    content: string;
    category: Category;
    author: {
        name: string;
        image?: string;
    };
    createdAt: string;
    status: "진행중" | "예정" | "완료";
};

// 임시 데이터
const announcements: Announcement[] = [
    {
        id: 1,
        title: "2024년 상반기 사역팀 모집 안내",
        content: `사랑하는 청년부 여러분,

2024년 상반기 사역팀 모집을 시작합니다. 
하나님 나라를 위해 함께 섬길 지체들을 기다립니다.

모집 사역팀:
- 찬양팀 (싱어, 악기)
- 미디어팀 (영상, 음향)
- 새가족팀
- 봉사팀

지원 마감: 2024년 3월 31일
문의: 청년부 담당 교역자`,
        category: "모집",
        author: {
            name: "관리자",
            image: "/avatars/admin.jpg",
        },
        createdAt: "2024-03-15",
        status: "진행중",
    },
    {
        id: 2,
        title: "부활절 특별 예배 안내",
        content: `[부활절 특별 예배 안내]

일시: 2024년 3월 31일 오전 11시
장소: 본당

특별 순서:
1. 특별 찬양
2. 성찬식
3. 세례식

부활의 기쁨을 함께 나누는 은혜로운 예배가 되길 소망합니다.`,
        category: "예배",
        author: {
            name: "관리자",
            image: "/avatars/admin.jpg",
        },
        createdAt: "2024-03-14",
        status: "예정",
    },
    {
        id: 3,
        title: "3월 셀 모임 일정 변경 안내",
        content: "3월 셀 모임이 행사 일정으로 인해 다음과 같이 변경되었습니다...",
        category: "셀모임",
        author: {
            name: "관리자",
            image: "/avatars/admin.jpg",
        },
        createdAt: "2024-03-10",
        status: "완료",
    },
];

const categories: Category[] = ["전체", "모집", "예배", "셀모임", "행사", "기타"];

export default function AnnouncementsPage() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.email === "admin@example.com"; // 실제 구현시 역할 기반으로 수정 필요
    const [selectedCategory, setSelectedCategory] = useState<Category>("전체");

    const filteredAnnouncements =
        selectedCategory === "전체"
            ? announcements
            : announcements.filter((a) => a.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background pb-16 md:pb-0">
            {/* 카테고리 필터 */}
            <div className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 md:top-0">
                <ScrollShadow
                    orientation="horizontal"
                    className="flex gap-2 p-4 overflow-x-auto hide-scrollbar"
                >
                    {categories.map((category) => (
                        <Chip
                            key={category}
                            variant={selectedCategory === category ? "solid" : "flat"}
                            color="primary"
                            className="cursor-pointer"
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Chip>
                    ))}
                </ScrollShadow>
            </div>

            {/* 공지사항 피드 */}
            <main className="container max-w-2xl mx-auto px-4 pt-36 md:pt-28">
                {isAdmin && (
                    <div className="mb-6">
                        <Button color="primary" startContent={<PlusIcon className="w-4 h-4" />}>
                            공지사항 작성
                        </Button>
                    </div>
                )}

                <div className="space-y-4">
                    {filteredAnnouncements.map((announcement) => (
                        <Card key={announcement.id} className="w-full">
                            <CardHeader className="flex gap-3">
                                <Avatar
                                    src={announcement.author.image}
                                    name={announcement.author.name}
                                    size="md"
                                    isBordered
                                />
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <p className="text-md font-semibold">
                                            {announcement.author.name}
                                        </p>
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color={
                                                announcement.status === "진행중"
                                                    ? "primary"
                                                    : announcement.status === "예정"
                                                    ? "warning"
                                                    : "default"
                                            }
                                        >
                                            {announcement.status}
                                        </Chip>
                                    </div>
                                    <p className="text-small text-default-500">
                                        {new Date(announcement.createdAt).toLocaleDateString(
                                            "ko-KR",
                                            {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardBody className="px-4 py-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <MegaphoneIcon className="w-5 h-5 text-primary" />
                                    <h2 className="text-lg font-semibold">{announcement.title}</h2>
                                </div>
                                <p className="text-gray-600 whitespace-pre-line">
                                    {announcement.content}
                                </p>
                            </CardBody>

                            <CardFooter className="px-4 pt-2 pb-4">
                                <div className="flex items-center gap-2">
                                    <Chip size="sm" variant="flat" color="primary">
                                        {announcement.category}
                                    </Chip>
                                    {announcement.status !== "완료" && (
                                        <div className="flex items-center gap-2 text-default-500 ml-2">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span className="text-sm">일정 보기</span>
                                        </div>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
