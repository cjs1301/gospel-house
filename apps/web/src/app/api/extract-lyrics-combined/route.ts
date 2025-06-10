import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ChatCompletionContentPart } from "openai/resources/chat/completions";
import { auth } from "@/auth";
import vision from "@google-cloud/vision";

// Google Cloud Vision 클라이언트 초기화
const visionClient = new vision.ImageAnnotatorClient({
    credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    },
});

export interface StructuredLyrics {
    title?: string;
    verses: {
        type: string;
        number?: number;
        lines: string[];
    }[];
}

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "nodejs"; // Vision API를 사용하기 위해 Node.js 런타임으로 변경

interface OCRResult {
    text: string;
    boundingBox: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    confidence: number;
}

async function extractTextFromImage(imageBuffer: Buffer): Promise<OCRResult[]> {
    try {
        // DOCUMENT_TEXT_DETECTION을 사용하여 더 나은 문서 처리
        const [result] = await visionClient.documentTextDetection({
            image: { content: imageBuffer },
            imageContext: {
                // 한국어와 영어 모두 지원하도록 언어 힌트 추가
                languageHints: ["ko", "en"],
            },
        });

        // fullTextAnnotation에서 구조화된 텍스트 추출
        const fullTextAnnotation = result.fullTextAnnotation;
        if (!fullTextAnnotation) {
            return [];
        }

        const ocrResults: OCRResult[] = [];

        // 페이지 단위로 처리
        for (const page of fullTextAnnotation.pages || []) {
            // 블록 단위로 텍스트 그룹화 (더 의미있는 단위)
            for (const block of page.blocks || []) {
                let blockText = "";
                const blockBounds = block.boundingBox;

                // 블록 내의 모든 문단 텍스트 결합
                for (const paragraph of block.paragraphs || []) {
                    let paragraphText = "";

                    for (const word of paragraph.words || []) {
                        let wordText = "";
                        for (const symbol of word.symbols || []) {
                            wordText += symbol.text || "";
                        }
                        paragraphText += wordText + " ";
                    }

                    blockText += paragraphText.trim() + " ";
                }

                // 의미있는 텍스트가 있는 블록만 추가
                const trimmedText = blockText.trim();
                if (trimmedText && trimmedText.length > 1) {
                    ocrResults.push({
                        text: trimmedText,
                        boundingBox: {
                            left: blockBounds?.vertices?.[0]?.x || 0,
                            top: blockBounds?.vertices?.[0]?.y || 0,
                            width:
                                (blockBounds?.vertices?.[2]?.x || 0) -
                                (blockBounds?.vertices?.[0]?.x || 0),
                            height:
                                (blockBounds?.vertices?.[2]?.y || 0) -
                                (blockBounds?.vertices?.[0]?.y || 0),
                        },
                        confidence: block.confidence || 0.9, // 블록 레벨에서는 일반적으로 높은 신뢰도
                    });
                }
            }
        }

        // 전체 텍스트도 하나의 결과로 추가 (컨텍스트 제공용)
        const fullText = fullTextAnnotation.text?.trim();
        if (fullText && ocrResults.length > 0) {
            // 전체 페이지의 바운딩 박스 계산
            const allBounds = ocrResults.map((r) => r.boundingBox);
            const minX = Math.min(...allBounds.map((b) => b.left));
            const minY = Math.min(...allBounds.map((b) => b.top));
            const maxX = Math.max(...allBounds.map((b) => b.left + b.width));
            const maxY = Math.max(...allBounds.map((b) => b.top + b.height));

            // 전체 텍스트를 첫 번째 요소로 추가
            ocrResults.unshift({
                text: fullText,
                boundingBox: {
                    left: minX,
                    top: minY,
                    width: maxX - minX,
                    height: maxY - minY,
                },
                confidence: 1.0,
            });
        }

        return ocrResults;
    } catch (error) {
        console.error("OCR 처리 중 오류:", error);
        throw error;
    }
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }
    const encoder = new TextEncoder();

    try {
        const formData = await request.formData();
        const images = formData.getAll("images") as File[];

        if (!images || images.length === 0) {
            return new Response(JSON.stringify({ error: "이미지가 제공되지 않았습니다." }), {
                status: 400,
            });
        }

        console.log(`처리 시작: ${images.length}개의 이미지`);

        // 각 이미지에서 OCR 수행
        console.log("OCR 처리 시작...");
        const ocrResults = await Promise.all(
            images.map(async (image, index) => {
                console.log(`이미지 ${index + 1} OCR 처리 중...`);
                try {
                    const bytes = await image.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const result = await extractTextFromImage(buffer);
                    console.log(`이미지 ${index + 1} OCR 완료: ${result.length}개 텍스트 발견`);
                    return result;
                } catch (error) {
                    console.error(`이미지 ${index + 1} OCR 실패:`, error);
                    throw error;
                }
            })
        );

        console.log("모든 OCR 처리 완료");

        // OCR 결과를 GPT에게 전달할 형식으로 변환 (이미지 레이아웃 보존)
        const ocrTextsForGPT = ocrResults
            .map((pageResults, pageIndex) => {
                if (pageResults.length === 0)
                    return `=== 페이지 ${pageIndex + 1} ===\n텍스트를 찾을 수 없습니다.`;

                // 전체 텍스트는 제외하고 실제 블록들만 처리 (첫 번째는 전체 텍스트)
                const textBlocks = pageResults.slice(1);

                // y 좌표 기준으로 정렬하여 위에서 아래 순서로 배치
                const sortedBlocks = textBlocks.sort(
                    (a, b) => a.boundingBox.top - b.boundingBox.top
                );

                // 비슷한 y 좌표를 가진 블록들을 같은 줄로 그룹화
                const lines: Array<{ y: number; blocks: typeof sortedBlocks }> = [];
                const yThreshold = 20; // 20px 이내면 같은 줄로 간주

                for (const block of sortedBlocks) {
                    const y = block.boundingBox.top;
                    let foundLine = false;

                    for (const line of lines) {
                        if (Math.abs(line.y - y) <= yThreshold) {
                            line.blocks.push(block);
                            foundLine = true;
                            break;
                        }
                    }

                    if (!foundLine) {
                        lines.push({ y, blocks: [block] });
                    }
                }

                // 각 줄 내에서 x 좌표 기준으로 정렬 (왼쪽에서 오른쪽)
                lines.forEach((line) => {
                    line.blocks.sort((a, b) => a.boundingBox.left - b.boundingBox.left);
                });

                // 제목 후보 식별 (상단 30% 영역에 있는 텍스트)
                const pageHeight = Math.max(
                    ...sortedBlocks.map((b) => b.boundingBox.top + b.boundingBox.height)
                );
                const titleAreaHeight = pageHeight * 0.3;
                const titleCandidates = lines.filter((line) => line.y <= titleAreaHeight);

                let pageText = `=== 페이지 ${pageIndex + 1} ===\n`;

                // 제목 후보가 있으면 표시
                if (titleCandidates.length > 0) {
                    pageText += `\n📌 제목 후보 (상단 영역):\n`;
                    titleCandidates.forEach((line, index) => {
                        const lineText = line.blocks.map((b) => b.text).join(" ");
                        pageText += `[제목${index + 1}] "${lineText}" (y:${Math.round(line.y)})\n`;
                    });
                    pageText += "\n";
                }

                pageText += `📄 전체 텍스트 (줄바꿈 보존):\n`;

                // 줄 단위로 텍스트 구성
                lines.forEach((line, lineIndex) => {
                    const lineText = line.blocks.map((block) => block.text).join(" ");
                    pageText += `[줄${lineIndex + 1}] "${lineText}" (y:${Math.round(line.y)})\n`;
                });

                console.log(
                    `페이지 ${pageIndex + 1}: ${lines.length}줄, ${sortedBlocks.length}개 블록`
                );
                return pageText;
            })
            .join("\n\n");

        console.log("GPT 처리 시작...");

        // GPT에게 전달할 메시지 준비
        const content: ChatCompletionContentPart[] = [
            {
                type: "text",
                text: `찬양 가사 정리 전문가입니다. OCR 데이터를 분석하여 가사를 정리해주세요.

${ocrTextsForGPT}

위 데이터를 분석하여 다음 형식으로 정리해주세요:

=== 곡제목 ===

가사 첫째 줄
가사 둘째 줄
가사 셋째 줄

중요한 규칙:
1. 📌 제목 후보를 참고하여 적절한 제목 선택
2. [줄1], [줄2] 순서대로 가사를 배치하여 원본 이미지의 줄바꿈 보존
3. 코드(Am7, F/G 등), 악보 기호, 페이지 번호 제거
4. 불필요한 기호나 공백 정리
5. 하이픈(-) 제거하고 분리된 음절 합치기
6. 절 구분([1절], [후렴] 등)은 제거하고 연속된 가사로 정리
7. 각 줄이 자연스럽게 이어지도록 정리

출력 규칙:
- 반드시 "=== 곡제목 ===" 형식 사용 (### 사용 금지)
- 설명 텍스트나 "---" 구분선 사용 금지
- 영어 설명 문장 사용 금지
- 바로 가사 내용만 출력
- 여러 곡이 있다면 각각 "=== 곡제목 ===" 형식으로 구분

이미지의 실제 레이아웃을 반영하여 깔끔한 가사만 출력해주세요.`,
            },
        ];

        // 스트림 응답 생성
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const completion = await openai.chat.completions.create({
                        model: "gpt-4o", // 더 큰 컨텍스트를 지원하는 모델
                        stream: true,
                        max_tokens: 3000,
                        messages: [
                            {
                                role: "user",
                                content,
                            },
                        ],
                    });

                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        controller.enqueue(encoder.encode(content));
                    }
                    console.log("GPT 스트리밍 완료");
                } catch (error) {
                    console.error("Streaming error:", error);
                    controller.enqueue(
                        encoder.encode(
                            `\n\n❌ 오류: 스트리밍 처리 중 문제가 발생했습니다.\n${error instanceof Error ? error.message : "알 수 없는 오류"}`
                        )
                    );
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("전체 처리 중 오류:", error);
        console.error("에러 스택:", error instanceof Error ? error.stack : "스택 정보 없음");
        return new Response(
            JSON.stringify({
                error: "가사 추출 중 오류가 발생했습니다.",
                details: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
