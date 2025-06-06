"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import {
    ArrowUpTrayIcon,
    DocumentTextIcon,
    PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { clsx } from "clsx";
import dynamic from "next/dynamic";

// React-PDF CSS 스타일을 정적으로 import
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// React-PDF 컴포넌트를 동적으로 로드
const Document = dynamic(() => import("react-pdf").then((mod) => mod.Document), {
    ssr: false,
});
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
    ssr: false,
});

export default function LyricExtractorPage() {
    const [isClient, setIsClient] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pdfjs, setPdfjs] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSlideshow, setShowSlideshow] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const [streamingText, setStreamingText] = useState<string>("");
    const [isStreamingComplete, setIsStreamingComplete] = useState(false);
    const [parsedLyrics, setParsedLyrics] = useState<{
        title: string;
        sections: Array<{
            type: string;
            lines: string[];
        }>;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // 클라이언트에서만 실행
        setIsClient(true);

        // Promise.withResolvers polyfill
        if (typeof Promise.withResolvers === "undefined") {
            // @ts-expect-error Adding polyfill for Promise.withResolvers to global Promise object
            Promise.withResolvers = function <T>() {
                let resolve: (value: T) => void;
                let reject: (reason?: unknown) => void;
                const promise = new Promise<T>((res, rej) => {
                    resolve = res;
                    reject = rej;
                });
                return { promise, resolve: resolve!, reject: reject! };
            };
        }

        // PDF.js 동적 로딩
        import("react-pdf").then((reactPdf) => {
            reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = new URL(
                "pdfjs-dist/build/pdf.worker.min.mjs",
                import.meta.url
            ).toString();
            setPdfjs(reactPdf.pdfjs);
        });
    }, []);

    const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    }, []);

    const handleFileSelect = useCallback((selectedFile: File) => {
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setCurrentPage(1);
            setShowSlideshow(false);
        } else {
            alert("PDF 파일만 업로드할 수 있습니다.");
        }
    }, []);

    const handleFileUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const uploadedFile = event.target.files?.[0];
            if (uploadedFile) {
                handleFileSelect(uploadedFile);
            }
        },
        [handleFileSelect]
    );

    // 드래그 앤 드롭 이벤트 핸들러
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);

            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                handleFileSelect(droppedFile);
            }
        },
        [handleFileSelect]
    );

    const handleUploadAreaClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    // PDF 페이지를 이미지로 변환하는 함수
    const convertPdfPageToImage = useCallback(
        async (file: File, pageNumber: number): Promise<Blob> => {
            if (!pdfjs) throw new Error("PDF.js가 로드되지 않았습니다.");

            return new Promise((resolve, reject) => {
                const loadingTask = pdfjs.getDocument(URL.createObjectURL(file));

                loadingTask.promise
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .then((pdf: any) => {
                        pdf.getPage(pageNumber)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            .then((page: any) => {
                                const scale = 2.0; // 고해상도를 위한 스케일
                                const viewport = page.getViewport({ scale });

                                const canvas = document.createElement("canvas");
                                const context = canvas.getContext("2d");

                                if (!context) {
                                    reject(new Error("Canvas context를 생성할 수 없습니다"));
                                    return;
                                }

                                canvas.height = viewport.height;
                                canvas.width = viewport.width;

                                const renderContext = {
                                    canvasContext: context,
                                    viewport: viewport,
                                };

                                page.render(renderContext)
                                    .promise.then(() => {
                                        canvas.toBlob((blob: Blob | null) => {
                                            if (blob) {
                                                resolve(blob);
                                            } else {
                                                reject(new Error("이미지 변환에 실패했습니다"));
                                            }
                                        }, "image/png");
                                    })
                                    .catch(reject);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            });
        },
        [pdfjs]
    );

    // 스트리밍 텍스트를 파싱하여 자막 형태로 변환
    const parseStreamingLyrics = (text: string) => {
        const lines = text.split("\n");
        let title = "";
        const sections: Array<{ type: string; lines: string[] }> = [];
        let currentSection: { type: string; lines: string[] } | null = null;

        for (const line of lines) {
            const trimmed = line.trim();

            // 제목 추출
            if (trimmed.startsWith("===") && trimmed.endsWith("===")) {
                title = trimmed.replace(/===/g, "").trim();
                continue;
            }

            // 섹션 헤더 ([1절], [후렴] 등)
            if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                if (currentSection && currentSection.lines.length > 0) {
                    sections.push(currentSection);
                }
                currentSection = {
                    type: trimmed.slice(1, -1),
                    lines: [],
                };
                continue;
            }

            // 가사 라인
            if (trimmed && currentSection) {
                currentSection.lines.push(trimmed);
            }
        }

        // 마지막 섹션 추가
        if (currentSection && currentSection.lines.length > 0) {
            sections.push(currentSection);
        }

        return { title, sections };
    };

    const extractLyricsFromPDF = useCallback(async () => {
        if (!file || !numPages || !pdfjs) return;

        setIsProcessing(true);
        setStreamingText("");
        setIsStreamingComplete(false);
        setParsedLyrics(null);

        try {
            const formData = new FormData();

            // 각 페이지를 이미지로 변환하여 FormData에 추가
            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const imageBlob = await convertPdfPageToImage(file, pageNum);
                formData.append("images", imageBlob, `page-${pageNum}.png`);
            }

            const response = await fetch("/api/extract-lyrics-combined", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("가사 추출에 실패했습니다.");
            }

            if (!response.body) {
                throw new Error("응답 스트림을 받을 수 없습니다.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    setIsStreamingComplete(true);
                    // 최종 파싱
                    const parsed = parseStreamingLyrics(accumulatedText);
                    setParsedLyrics(parsed);
                    break;
                }

                const chunk = decoder.decode(value);
                accumulatedText += chunk;
                setStreamingText(accumulatedText);

                // 실시간 파싱 (부분적)
                const parsed = parseStreamingLyrics(accumulatedText);
                if (parsed.sections.length > 0) {
                    setParsedLyrics(parsed);
                }
            }
        } catch (error) {
            console.error("가사 추출 오류:", error);
            alert("가사 추출 중 오류가 발생했습니다.");
        } finally {
            setIsProcessing(false);
        }
    }, [file, numPages, convertPdfPageToImage, pdfjs]);

    const generateSlideshow = useCallback(() => {
        if (parsedLyrics && parsedLyrics.sections.length > 0) {
            setShowSlideshow(true);
            setCurrentSlide(0);
        }
    }, [parsedLyrics]);

    const nextSlide = useCallback(() => {
        if (parsedLyrics) {
            setCurrentSlide((prev) => (prev + 1) % parsedLyrics.sections.length);
        }
    }, [parsedLyrics]);

    const prevSlide = useCallback(() => {
        if (parsedLyrics) {
            setCurrentSlide(
                (prev) => (prev - 1 + parsedLyrics.sections.length) % parsedLyrics.sections.length
            );
        }
    }, [parsedLyrics]);

    // 로딩 상태
    if (!isClient || !pdfjs) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">가사 추출기를 로딩 중...</p>
                </div>
            </div>
        );
    }

    if (showSlideshow && parsedLyrics) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col">
                <div className="p-4 bg-gray-900 flex justify-between items-center">
                    <Button color="default" variant="flat" onPress={() => setShowSlideshow(false)}>
                        편집 모드로 돌아가기
                    </Button>
                    <div className="text-sm text-gray-400">
                        {currentSlide + 1} / {parsedLyrics.sections.length}
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-4xl">
                        {parsedLyrics.sections[currentSlide] && (
                            <div className="text-4xl md:text-6xl font-bold leading-tight whitespace-pre-line">
                                {parsedLyrics.sections[currentSlide].lines.join("\n")}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-gray-900 flex justify-center gap-4">
                    <Button
                        color="primary"
                        variant="flat"
                        onPress={prevSlide}
                        isDisabled={parsedLyrics.sections.length <= 1}
                    >
                        이전
                    </Button>
                    <Button
                        color="primary"
                        variant="flat"
                        onPress={nextSlide}
                        isDisabled={parsedLyrics.sections.length <= 1}
                    >
                        다음
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">악보 가사 추출기</h1>
                    <p className="text-gray-600">
                        PDF 악보에서 가사를 추출하여 자막 슬라이드쇼를 만들어보세요
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* PDF 업로드 및 미리보기 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <DocumentTextIcon className="w-6 h-6" />
                            PDF 업로드 및 미리보기
                        </h2>

                        <div className="mb-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
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
                                          : "PDF 파일을 선택하거나 드래그하세요"}
                                </p>
                                {!file && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        클릭하거나 파일을 드래그해서 업로드하세요
                                    </p>
                                )}
                            </div>
                        </div>

                        {file && (
                            <>
                                <div className="mb-4 flex gap-2 flex-wrap">
                                    <Button
                                        onPress={extractLyricsFromPDF}
                                        isLoading={isProcessing}
                                        startContent={<DocumentTextIcon className="w-4 h-4" />}
                                        isDisabled={!numPages}
                                    >
                                        가사 추출하기 {numPages && `(${numPages}페이지)`}
                                    </Button>

                                    {parsedLyrics && parsedLyrics.sections.length > 0 && (
                                        <Button
                                            color="success"
                                            onPress={generateSlideshow}
                                            startContent={
                                                <PresentationChartLineIcon className="w-4 h-4" />
                                            }
                                        >
                                            슬라이드쇼 보기
                                        </Button>
                                    )}
                                </div>

                                <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-auto">
                                    <Document
                                        file={file}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        loading={
                                            <div className="text-center p-4">PDF 로딩 중...</div>
                                        }
                                        error={
                                            <div className="text-center p-4 text-red-600">
                                                PDF 로딩 실패
                                            </div>
                                        }
                                    >
                                        <Page
                                            pageNumber={currentPage}
                                            width={400}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    </Document>

                                    {numPages && numPages > 1 && (
                                        <div className="mt-4 flex justify-between items-center">
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                onPress={() =>
                                                    setCurrentPage(Math.max(1, currentPage - 1))
                                                }
                                                isDisabled={currentPage <= 1}
                                            >
                                                이전 페이지
                                            </Button>
                                            <span className="text-sm text-gray-600">
                                                {currentPage} / {numPages}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                onPress={() =>
                                                    setCurrentPage(
                                                        Math.min(numPages, currentPage + 1)
                                                    )
                                                }
                                                isDisabled={currentPage >= numPages}
                                            >
                                                다음 페이지
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* 추출된 가사 */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">추출된 가사</h2>

                        {parsedLyrics && parsedLyrics.sections.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {parsedLyrics.title && (
                                    <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                                        <h3 className="text-xl font-bold text-center text-blue-800">
                                            {parsedLyrics.title}
                                        </h3>
                                    </div>
                                )}
                                {parsedLyrics.sections.map((section, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="text-lg font-semibold text-gray-700 mb-3">
                                            {section.type}
                                        </div>
                                        <div className="space-y-2">
                                            {section.lines.map((line, lineIndex) => (
                                                <p
                                                    key={lineIndex}
                                                    className="text-gray-800 text-lg leading-relaxed"
                                                >
                                                    {line}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : isStreamingComplete && !isProcessing ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>가사를 추출할 수 없었습니다.</p>
                                <p className="text-sm mt-1">다른 PDF 파일을 시도해보세요.</p>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                {isProcessing ? (
                                    <div>
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                        <p>가사를 추출하고 있습니다...</p>
                                        <p className="text-sm mt-1">
                                            GPT-4.1로 악보를 분석하고 있어요
                                        </p>

                                        {/* 실시간 가사 미리보기 */}
                                        {parsedLyrics && (
                                            <div className="mt-6 max-w-3xl mx-auto">
                                                <div className="bg-white rounded-lg shadow-lg p-6">
                                                    {parsedLyrics.title && (
                                                        <div className="text-xl font-bold text-center text-blue-600 mb-4">
                                                            {parsedLyrics.title}
                                                        </div>
                                                    )}
                                                    {parsedLyrics.sections.map((section, index) => (
                                                        <div key={index} className="mb-4 last:mb-0">
                                                            <div className="text-lg font-semibold text-gray-700 mb-2">
                                                                {section.type}
                                                            </div>
                                                            <div className="space-y-1">
                                                                {section.lines.map(
                                                                    (line, lineIndex) => (
                                                                        <p
                                                                            key={lineIndex}
                                                                            className="text-gray-800 leading-relaxed"
                                                                        >
                                                                            {line}
                                                                        </p>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {!isStreamingComplete && (
                                                        <div className="text-center text-gray-500 mt-4">
                                                            <span className="animate-pulse">
                                                                처리 중...
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* 디버깅용 원본 텍스트 */}
                                        {streamingText && !parsedLyrics && (
                                            <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left max-h-32 overflow-y-auto">
                                                <p className="text-xs text-gray-600 mb-2">
                                                    실시간 응답:
                                                </p>
                                                <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words">
                                                    {streamingText}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p>PDF를 업로드하고 가사 추출을 시작하세요</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
