import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ChatCompletionContentPart } from "openai/resources/chat/completions";

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

export const runtime = "edge"; // Edge Runtime 사용

export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();

    try {
        // OpenAI API 키 검증
        if (!process.env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({ error: "OpenAI API 키가 설정되지 않았습니다." }), {
                status: 500,
            });
        }

        const formData = await request.formData();
        const images = formData.getAll("images") as File[];

        if (!images || images.length === 0) {
            return new Response(JSON.stringify({ error: "이미지가 제공되지 않았습니다." }), {
                status: 400,
            });
        }

        console.log(`처리 시작: ${images.length}개의 이미지`);

        // 이미지를 base64로 변환
        const imageContents = await Promise.all(
            images.map(async (image) => {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                return buffer.toString("base64");
            })
        );

        // 메시지 컨텐츠 준비
        const content: ChatCompletionContentPart[] = [
            {
                type: "text",
                text: "당신은 찬양 가사를 추출하여 자막 PPT용으로 정리하는 전문가입니다.\n\n악보 이미지에서 가사를 추출하여 다음 형식으로 응답해주세요:\n\n=== 곡제목 ===\n\n[1절]\n가사 첫째 줄\n가사 둘째 줄\n가사 셋째 줄\n\n[후렴]\n후렴 가사 첫째 줄\n후렴 가사 둘째 줄\n\n[2절]\n가사 첫째 줄\n가사 둘째 줄\n\n다음 규칙을 따라주세요:\n1. 각 절은 [1절], [2절], [후렴], [브릿지] 등으로 구분\n2. 코드(예: Am7, F/G, Csus4 등)는 모두 제거\n3. 반복 기호나 악보 기호 제거\n4. 페이지 번호나 머리말/꼬리말 제거\n5. 불필요한 기호나 공백 제거\n6. 띄어쓰기 교정\n7. 각 줄의 끝에 있는 하이픈(-) 제거\n8. 불필요하게 분리된 음절 합치기\n9. 깔끔하고 읽기 쉽게 정리\n\n이 악보 이미지들에서 가사를 추출하고 자막 PPT용으로 정리해주세요.",
            },
            ...imageContents.map(
                (content) =>
                    ({
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${content}`,
                        },
                    }) as const
            ),
        ];

        // 스트림 응답 생성
        const stream = new ReadableStream({
            async start(controller) {
                const completion = await openai.chat.completions.create({
                    model: "gpt-4.1",
                    stream: true,
                    max_tokens: 4000,
                    messages: [
                        {
                            role: "user",
                            content,
                        },
                    ],
                });

                try {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content || "";

                        // 청크 데이터를 클라이언트로 전송
                        controller.enqueue(encoder.encode(content));
                    }
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
        console.error("Error:", error);
        return new Response(
            JSON.stringify({
                error: "가사 추출 중 오류가 발생했습니다.",
                details: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
