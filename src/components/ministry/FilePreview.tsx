"use client";

import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import Image from "next/image";

interface FilePreviewProps {
    file: {
        name: string;
        url: string;
        type: string;
    };
}

export default function FilePreview({ file }: FilePreviewProps) {
    // const isPDF = file.type.includes("pdf");
    const isImage = file.type.includes("image");

    return (
        <Card className="w-full">
            <CardHeader className="flex items-center justify-between px-4 py-3">
                <h3 className="text-lg font-medium">{file.name}</h3>
                <Button
                    as="a"
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="primary"
                    variant="light"
                    size="sm"
                >
                    다운로드
                </Button>
            </CardHeader>
            <CardBody className="p-0">
                {isImage ? (
                    <div className="relative w-full h-[600px]">
                        <Image
                            src={file.url}
                            alt={file.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[200px] text-gray-500">
                        미리보기를 지원하지 않는 파일 형식입니다.
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
