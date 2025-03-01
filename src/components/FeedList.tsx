"use client";

import Image from "next/image";
import { HeartIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Image as HeroImage } from "@heroui/image";
import { Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter } from "@heroui/drawer";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { User } from "@heroui/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import type { ChurchFeed, User as PrismaUser, FeedComment } from "@prisma/client";

interface FeedWithDetails extends ChurchFeed {
    author: PrismaUser;
    comments: Array<FeedComment & { user: PrismaUser }>;
    likes: { userId: string }[];
    images: { id: string; url: string; order: number }[];
    _count: {
        likes: number;
        comments: number;
    };
}

interface FeedListProps {
    feeds: FeedWithDetails[];
    userId: string;
}

export default function FeedList({ feeds, userId }: FeedListProps) {
    const { data: session } = useSession();
    const [selectedFeed, setSelectedFeed] = useState<FeedWithDetails | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [commentText, setCommentText] = useState("");

    const handleCommentClick = (feed: FeedWithDetails) => {
        setSelectedFeed(feed);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedFeed(null);
        setCommentText("");
    };

    return (
        <>
            {/* 피드 섹션 */}
            <div className="max-w-2xl mx-auto space-y-8">
                {feeds.map((feed) => (
                    <Card key={feed.id} className="w-full">
                        <CardHeader className="flex gap-3">
                            <Avatar
                                src={feed.author.image || undefined}
                                name={feed.author.name || undefined}
                                size="md"
                                radius="full"
                                color="default"
                                isBordered
                                showFallback
                            />
                            <div className="flex flex-col">
                                <p className="text-md font-semibold">{feed.author.name}</p>
                                <p className="text-small text-default-500">
                                    {new Date(feed.createdAt).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </CardHeader>

                        {feed.images[0] && (
                            <HeroImage
                                as={Image}
                                src={feed.images[0].url}
                                alt={`${feed.author.name}님의 피드 이미지`}
                                width={0}
                                height={0}
                                sizes="(max-width: 768px) 100vw, 768px"
                                className="w-full aspect-[4/3] object-cover rounded-none"
                                style={{ height: "auto" }}
                                isZoomed
                                classNames={{
                                    wrapper: "w-full aspect-[4/3] rounded-none overflow-hidden",
                                    zoomedWrapper: "!w-full !h-full rounded-none",
                                }}
                                fallbackSrc="/placeholder-image.jpg"
                            />
                        )}

                        <CardBody className="px-4 py-3">
                            <p className="text-gray-800 whitespace-pre-line">{feed.content}</p>
                        </CardBody>

                        <CardFooter className="flex justify-between items-center px-4 pt-2 pb-4">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    {feed.likes.some((like) => like.userId === userId) ? (
                                        <HeartIconSolid className="h-6 w-6 text-red-500" />
                                    ) : (
                                        <HeartIcon className="h-6 w-6 text-gray-400" />
                                    )}
                                    <span className="text-gray-500">{feed._count.likes}</span>
                                </div>
                                <button
                                    onClick={() => handleCommentClick(feed)}
                                    className="flex items-center space-x-2"
                                >
                                    <ChatBubbleLeftIcon className="h-6 w-6 text-gray-400" />
                                    <span className="text-gray-500">{feed._count.comments}</span>
                                </button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* 댓글 Drawer */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                placement="bottom"
                size="4xl"
                isDismissable={true}
                hideCloseButton={false}
                radius="lg"
                classNames={{
                    header: "border-b",
                    body: "px-4",
                    footer: "border-t bg-white/80 backdrop-blur-md",
                    backdrop: "bg-black/30",
                }}
            >
                <DrawerContent>
                    <DrawerHeader className="flex flex-col items-center py-2">
                        {/* 드래그 핸들 표시 */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mb-4" />
                        <div className="flex items-center justify-between w-full px-4">
                            <h4 className="text-lg font-semibold">
                                댓글 {selectedFeed?._count.comments}개
                            </h4>
                        </div>
                    </DrawerHeader>
                    <DrawerBody className="overflow-y-auto">
                        {selectedFeed?.comments?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <ChatBubbleLeftIcon className="w-12 h-12 mb-2" />
                                <p>첫 댓글을 남겨보세요</p>
                            </div>
                        ) : (
                            selectedFeed?.comments?.map((comment) => (
                                <div key={comment.id} className="py-4 flex items-start space-x-3">
                                    <Avatar
                                        src={comment.user.image || undefined}
                                        name={comment.user.name || undefined}
                                        size="sm"
                                        radius="full"
                                    />
                                    <div>
                                        <p className="font-medium">{comment.user.name}</p>
                                        <p className="text-gray-600">{comment.content}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(comment.createdAt).toLocaleDateString(
                                                "ko-KR"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </DrawerBody>
                    <DrawerFooter className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                            <User
                                name={session?.user?.name || ""}
                                avatarProps={{
                                    src: session?.user?.image || "",
                                    alt: session?.user?.name || "",
                                    size: "sm",
                                    radius: "full",
                                }}
                                classNames={{
                                    base: "min-w-fit",
                                    name: "hidden",
                                }}
                            />
                            <div className="flex-1 flex items-center space-x-2">
                                <Input
                                    placeholder="댓글을 입력하세요..."
                                    value={commentText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setCommentText(e.target.value)
                                    }
                                    className="flex-1"
                                    size="sm"
                                    autoFocus
                                />
                                <Button size="sm" color="primary" isDisabled={!commentText.trim()}>
                                    게시
                                </Button>
                            </div>
                        </div>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
