"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// PDF worker 설정 수정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
    url: string;
    onLoadSuccess: ({ numPages }: { numPages: number }) => void;
    pageNumber: number;
}

export default function PDFViewer({ url, onLoadSuccess, pageNumber }: PDFViewerProps) {
    return (
        <Document
            file={url}
            onLoadSuccess={onLoadSuccess}
            loading={<div className="flex items-center justify-center h-[600px]">로딩중...</div>}
            error={
                <div className="flex items-center justify-center h-[600px] text-red-500">
                    PDF를 불러오는데 실패했습니다.
                </div>
            }
        >
            <Page
                pageNumber={pageNumber}
                width={Math.min(typeof window !== "undefined" ? window.innerWidth - 100 : 800, 800)}
                renderTextLayer={true}
                renderAnnotationLayer={true}
            />
        </Document>
    );
}
