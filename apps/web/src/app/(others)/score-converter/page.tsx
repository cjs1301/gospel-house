"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@heroui/react";
import { ArrowUpTrayIcon, MusicalNoteIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

// MIDI 음계 정의
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default function ScoreConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentKey, setCurrentKey] = useState<string>("C");
    const [targetKey, setTargetKey] = useState<string>("C");
    const [midiUrl, setMidiUrl] = useState<string | null>(null);
    const [recognizedNotes, setRecognizedNotes] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (uploadedFiles && uploadedFiles.length > 0) {
            const selectedFile = uploadedFiles[0];
            if (selectedFile.type.startsWith("image/")) {
                setFile(selectedFile);
                setErrorMessage(null);
            } else {
                setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
            }
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            const droppedFile = droppedFiles[0];
            if (droppedFile.type.startsWith("image/")) {
                setFile(droppedFile);
                setErrorMessage(null);
            } else {
                setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
            }
        }
    }, []);

    const handleUploadAreaClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const convertToMidi = useCallback(async () => {
        if (!file) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("currentKey", currentKey);
            formData.append("targetKey", targetKey);

            const response = await fetch("/api/convert-score-to-midi", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("악보 변환 중 오류가 발생했습니다.");
            }

            const data = await response.json();
            setMidiUrl(data.midiUrl);
            setRecognizedNotes(data.notes || []);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
            );
        } finally {
            setIsProcessing(false);
        }
    }, [file, currentKey, targetKey]);

    const handleKeyChange = useCallback(() => {
        // 키 변경 로직 구현
        if (!midiUrl) return;

        setIsProcessing(true);
        // TODO: MIDI 키 변경 API 호출
        setIsProcessing(false);
    }, [midiUrl]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">악보 변환기</h1>
                    <p className="text-gray-600">
                        악보 이미지를 업로드하여 MIDI로 변환하고 원하는 키로 변경해보세요
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 파일 업로드 섹션 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <MusicalNoteIcon className="w-6 h-6" />
                            악보 업로드
                        </h2>

                        <div className="mb-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <div
                                onClick={handleUploadAreaClick}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={clsx(
                                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
                                    isDragOver
                                        ? "border-blue-500 bg-blue-100 scale-105"
                                        : file
                                          ? "border-blue-300 bg-blue-50"
                                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                                )}
                            >
                                <ArrowUpTrayIcon
                                    className={clsx(
                                        "w-12 h-12 mx-auto mb-4 transition-colors",
                                        isDragOver ? "text-blue-500" : "text-gray-400"
                                    )}
                                />
                                <p className="text-gray-600">
                                    {isDragOver
                                        ? "파일을 여기에 놓으세요"
                                        : file
                                          ? file.name
                                          : "악보 이미지를 선택하거나 드래그하세요"}
                                </p>
                                {!file && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        지원 형식: JPG, PNG, WebP
                                    </p>
                                )}
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                                {errorMessage}
                            </div>
                        )}

                        {file && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            현재 키
                                        </label>
                                        <select
                                            value={currentKey}
                                            onChange={(e) => setCurrentKey(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {NOTES.map((note) => (
                                                <option key={note} value={note}>
                                                    {note}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            목표 키
                                        </label>
                                        <select
                                            value={targetKey}
                                            onChange={(e) => setTargetKey(e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {NOTES.map((note) => (
                                                <option key={note} value={note}>
                                                    {note}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onPress={convertToMidi}
                                        isLoading={isProcessing}
                                        startContent={<MusicalNoteIcon className="w-4 h-4" />}
                                    >
                                        MIDI 변환
                                    </Button>
                                    {midiUrl && (
                                        <Button
                                            color="secondary"
                                            onPress={handleKeyChange}
                                            isLoading={isProcessing}
                                            startContent={<ArrowPathIcon className="w-4 h-4" />}
                                        >
                                            키 변경
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}

                        {file && (
                            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="업로드된 악보"
                                    className="w-full h-auto rounded-lg"
                                    onLoad={(e) =>
                                        URL.revokeObjectURL((e.target as HTMLImageElement).src)
                                    }
                                />
                            </div>
                        )}
                    </div>

                    {/* 변환 결과 섹션 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">변환 결과</h2>

                        {isProcessing ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">악보를 분석하고 있습니다...</p>
                            </div>
                        ) : midiUrl ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-semibold mb-2">인식된 음표</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {recognizedNotes.map((note, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded"
                                            >
                                                {note}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">MIDI 파일</h3>
                                    <div className="flex items-center gap-4">
                                        <audio controls src={midiUrl} className="w-full" />
                                        <a
                                            href={midiUrl}
                                            download="converted_score.mid"
                                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <ArrowUpTrayIcon className="w-4 h-4" />
                                            다운로드
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>악보를 업로드하고 변환을 시작하세요</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
