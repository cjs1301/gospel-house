"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/react";
import {
    DocumentIcon,
    MusicalNoteIcon,
    ArrowUpTrayIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import FilePreview from "./FilePreview";

interface MinistryFile {
    id: string;
    name: string;
    url: string;
    type: string;
    createdAt: string;
    size: number;
}

interface MinistryArchiveProps {
    files: MinistryFile[];
    isLeader: boolean;
    ministryId: string;
}

export default function MinistryArchive({ files, isLeader, ministryId }: MinistryArchiveProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<MinistryFile | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handleFileUpload");
        if (!e.target.files?.length) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`/api/ministries/${ministryId}/files`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("파일 업로드에 실패했습니다.");
            }

            // 페이지를 새로고침하여 새 파일 목록을 가져옵니다
            window.location.reload();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("파일 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const handleFileDelete = async (fileId: string) => {
        if (!confirm("정말 이 파일을 삭제하시겠습니까?")) return;

        try {
            const response = await fetch(`/api/ministries/${ministryId}/files/${fileId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("파일 삭제에 실패했습니다.");
            }

            // 페이지를 새로고침하여 업데이트된 파일 목록을 가져옵니다
            window.location.reload();
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("파일 삭제에 실패했습니다.");
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (type: string) => {
        if (type.includes("pdf") || type.includes("document")) {
            return <DocumentIcon className="h-6 w-6" />;
        }
        return <MusicalNoteIcon className="h-6 w-6" />;
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    const canPreview = (type: string) => {
        return type.includes("pdf") || type.includes("image");
    };

    return (
        <div className="space-y-6">
            {isLeader && (
                <div className="flex justify-end">
                    <Button
                        color="primary"
                        startContent={<ArrowUpTrayIcon className="h-4 w-4" />}
                        disabled={uploading}
                        onPress={handleButtonClick}
                    >
                        {uploading ? "업로드 중..." : "파일 업로드"}
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                </div>
            )}

            {selectedFile && canPreview(selectedFile.type) && <FilePreview file={selectedFile} />}

            <div className="grid gap-4">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                    >
                        <div
                            className="flex items-center space-x-4 cursor-pointer"
                            onClick={() =>
                                setSelectedFile(selectedFile?.id === file.id ? null : file)
                            }
                        >
                            {getFileIcon(file.type)}
                            <div>
                                <h4 className="font-medium">{file.name}</h4>
                                <p className="text-sm text-gray-500">
                                    {formatFileSize(file.size)} ·{" "}
                                    {new Date(file.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
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
                            {isLeader && (
                                <Button
                                    color="danger"
                                    variant="light"
                                    size="sm"
                                    isIconOnly
                                    onPress={() => handleFileDelete(file.id)}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
                {files.length === 0 && (
                    <div className="text-center py-8 text-gray-500">업로드된 파일이 없습니다.</div>
                )}
            </div>
        </div>
    );
}
