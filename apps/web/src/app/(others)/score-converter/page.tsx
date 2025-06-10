"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@heroui/react";
import {
    ArrowUpTrayIcon,
    MusicalNoteIcon,
    ArrowPathIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";

// MIDI 음계 정의
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const OCTAVES = [3, 4, 5, 6, 7];
const NOTE_DURATIONS = [
    { label: "온음표", value: "whole", symbol: "𝅗𝅥" },
    { label: "2분음표", value: "half", symbol: "𝅗𝅥" },
    { label: "4분음표", value: "quarter", symbol: "𝅘𝅥" },
    { label: "8분음표", value: "eighth", symbol: "𝅘𝅥𝅮" },
    { label: "16분음표", value: "sixteenth", symbol: "𝅘𝅥𝅯" },
];

interface ExtractedNote {
    id: string;
    pitch: string;
    octave: number;
    duration: string;
    measure: number;
    beat: number;
}

export default function ScoreConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [currentKey, setCurrentKey] = useState<string>("C");
    const [targetKey, setTargetKey] = useState<string>("C");
    const [extractedNotes, setExtractedNotes] = useState<ExtractedNote[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = event.target.files;
        if (uploadedFiles && uploadedFiles.length > 0) {
            const selectedFile = uploadedFiles[0];
            if (selectedFile.type.startsWith("image/")) {
                setFile(selectedFile);
                setErrorMessage(null);
                setExtractedNotes([]);
                setGeneratedImageUrl(null);
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
                setExtractedNotes([]);
                setGeneratedImageUrl(null);
            } else {
                setErrorMessage("이미지 파일만 업로드할 수 있습니다.");
            }
        }
    }, []);

    const handleUploadAreaClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const extractNotesFromScore = useCallback(async () => {
        if (!file) return;

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("/api/extract-notes-from-score", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("악보 분석 중 오류가 발생했습니다.");
            }

            const data = await response.json();
            const notes: ExtractedNote[] = data.notes.map(
                (
                    note: {
                        pitch?: string;
                        octave?: number;
                        duration?: string;
                        measure?: number;
                        beat?: number;
                    },
                    index: number
                ) => ({
                    id: `note-${index}`,
                    pitch: note.pitch || "C",
                    octave: note.octave || 4,
                    duration: note.duration || "quarter",
                    measure: note.measure || 1,
                    beat: note.beat || 1,
                })
            );

            setExtractedNotes(notes);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다."
            );
        } finally {
            setIsProcessing(false);
        }
    }, [file]);

    const updateNote = useCallback((noteId: string, updates: Partial<ExtractedNote>) => {
        setExtractedNotes((prev) =>
            prev.map((note) => (note.id === noteId ? { ...note, ...updates } : note))
        );
    }, []);

    const deleteNote = useCallback((noteId: string) => {
        setExtractedNotes((prev) => prev.filter((note) => note.id !== noteId));
    }, []);

    const addNote = useCallback(() => {
        const newNote: ExtractedNote = {
            id: `note-${Date.now()}`,
            pitch: "C",
            octave: 4,
            duration: "quarter",
            measure: 1,
            beat: 1,
        };
        setExtractedNotes((prev) => [...prev, newNote]);
    }, []);

    const transposeNotes = useCallback(() => {
        if (currentKey === targetKey) return;

        // 키 변경 로직
        const semitoneShift = NOTES.indexOf(targetKey) - NOTES.indexOf(currentKey);

        setExtractedNotes((prev) =>
            prev.map((note) => {
                const currentNoteIndex = NOTES.indexOf(note.pitch);
                let newNoteIndex = (currentNoteIndex + semitoneShift) % 12;
                if (newNoteIndex < 0) newNoteIndex += 12;

                return {
                    ...note,
                    pitch: NOTES[newNoteIndex],
                };
            })
        );

        setCurrentKey(targetKey);
    }, [currentKey, targetKey]);

    const generateScoreImage = useCallback(async () => {
        if (extractedNotes.length === 0) {
            setErrorMessage("생성할 음표가 없습니다.");
            return;
        }

        setIsGeneratingImage(true);
        setErrorMessage(null);

        try {
            const response = await fetch("/api/generate-score-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    notes: extractedNotes,
                    key: currentKey,
                }),
            });

            if (!response.ok) {
                throw new Error("악보 생성 중 오류가 발생했습니다.");
            }

            const data = await response.json();
            setGeneratedImageUrl(data.imageUrl);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "악보 생성 중 오류가 발생했습니다."
            );
        } finally {
            setIsGeneratingImage(false);
        }
    }, [extractedNotes, currentKey]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">악보 변환기</h1>
                    <p className="text-gray-600">
                        악보 이미지를 업로드하여 음표를 추출하고, 편집 후 새로운 악보 이미지를
                        생성하세요
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* 1. 파일 업로드 섹션 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <ArrowUpTrayIcon className="w-6 h-6" />
                            1. 악보 업로드
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

                        {file && (
                            <div className="space-y-4">
                                <Button
                                    onPress={extractNotesFromScore}
                                    isLoading={isProcessing}
                                    className="w-full"
                                    startContent={<MusicalNoteIcon className="w-4 h-4" />}
                                >
                                    음표 추출하기
                                </Button>

                                <div className="border rounded-lg p-4 bg-gray-50">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="업로드된 악보"
                                        className="w-full h-auto rounded-lg"
                                        onLoad={(e) =>
                                            URL.revokeObjectURL((e.target as HTMLImageElement).src)
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                                {errorMessage}
                            </div>
                        )}
                    </div>

                    {/* 2. 음표 편집 섹션 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <PencilIcon className="w-6 h-6" />
                            2. 음표 편집
                        </h2>

                        {extractedNotes.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                        총 {extractedNotes.length}개 음표
                                    </span>
                                    <Button
                                        size="sm"
                                        color="secondary"
                                        onPress={addNote}
                                        startContent={<PlusIcon className="w-4 h-4" />}
                                    >
                                        음표 추가
                                    </Button>
                                </div>

                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {extractedNotes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="border rounded-lg p-3 bg-gray-50"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-medium">
                                                    마디 {note.measure}, 박자 {note.beat}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="light"
                                                    onPress={() => deleteNote(note.id)}
                                                    startContent={<TrashIcon className="w-3 h-3" />}
                                                >
                                                    삭제
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        음높이
                                                    </label>
                                                    <select
                                                        value={note.pitch}
                                                        onChange={(e) =>
                                                            updateNote(note.id, {
                                                                pitch: e.target.value,
                                                            })
                                                        }
                                                        className="w-full text-sm rounded border-gray-300"
                                                    >
                                                        {NOTES.map((n) => (
                                                            <option key={n} value={n}>
                                                                {n}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        옥타브
                                                    </label>
                                                    <select
                                                        value={note.octave}
                                                        onChange={(e) =>
                                                            updateNote(note.id, {
                                                                octave: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="w-full text-sm rounded border-gray-300"
                                                    >
                                                        {OCTAVES.map((oct) => (
                                                            <option key={oct} value={oct}>
                                                                {oct}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        음표 길이
                                                    </label>
                                                    <select
                                                        value={note.duration}
                                                        onChange={(e) =>
                                                            updateNote(note.id, {
                                                                duration: e.target.value,
                                                            })
                                                        }
                                                        className="w-full text-sm rounded border-gray-300"
                                                    >
                                                        {NOTE_DURATIONS.map((dur) => (
                                                            <option
                                                                key={dur.value}
                                                                value={dur.value}
                                                            >
                                                                {dur.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        마디
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={note.measure}
                                                        onChange={(e) =>
                                                            updateNote(note.id, {
                                                                measure:
                                                                    parseInt(e.target.value) || 1,
                                                            })
                                                        }
                                                        className="w-full text-sm rounded border-gray-300"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                현재 키
                                            </label>
                                            <select
                                                value={currentKey}
                                                onChange={(e) => setCurrentKey(e.target.value)}
                                                className="w-full rounded border-gray-300"
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
                                                className="w-full rounded border-gray-300"
                                            >
                                                {NOTES.map((note) => (
                                                    <option key={note} value={note}>
                                                        {note}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        color="secondary"
                                        onPress={transposeNotes}
                                        className="w-full"
                                        isDisabled={currentKey === targetKey}
                                        startContent={<ArrowPathIcon className="w-4 h-4" />}
                                    >
                                        조바꿈 적용
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>악보를 업로드하고 음표를 추출해주세요</p>
                            </div>
                        )}
                    </div>

                    {/* 3. 결과 이미지 생성 섹션 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <MusicalNoteIcon className="w-6 h-6" />
                            3. 악보 생성
                        </h2>

                        {extractedNotes.length > 0 ? (
                            <div className="space-y-4">
                                <Button
                                    color="success"
                                    onPress={generateScoreImage}
                                    isLoading={isGeneratingImage}
                                    className="w-full"
                                    startContent={<MusicalNoteIcon className="w-4 h-4" />}
                                >
                                    악보 이미지 생성
                                </Button>

                                {generatedImageUrl && (
                                    <div className="space-y-4">
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            <img
                                                src={generatedImageUrl}
                                                alt="생성된 악보"
                                                className="w-full h-auto rounded-lg"
                                            />
                                        </div>

                                        <a
                                            href={generatedImageUrl}
                                            download="converted_score.jpg"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <ArrowUpTrayIcon className="w-4 h-4" />
                                            JPEG 다운로드
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>음표를 편집한 후 악보를 생성해주세요</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Canvas for rendering (hidden) */}
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}
