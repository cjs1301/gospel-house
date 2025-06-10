import { NextRequest } from "next/server";
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

interface ExtractedNote {
    pitch: string;
    octave: number;
    duration: string;
    measure: number;
    beat: number;
    confidence: number;
}

// 음표 기호와 실제 음높이 매핑
const NOTE_SYMBOLS: { [key: string]: string } = {
    "♩": "quarter",
    "♪": "eighth",
    "𝅗𝅥": "whole",
    "𝅘𝅥": "quarter",
    "𝅘𝅥𝅮": "eighth",
    "𝅘𝅥𝅯": "sixteenth",
    "♬": "eighth",
    "♫": "eighth",
};

// 음표 이름 매핑
const NOTE_NAMES: { [key: string]: string } = {
    도: "C",
    레: "D",
    미: "E",
    파: "F",
    솔: "G",
    라: "A",
    시: "B",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G",
    A: "A",
    B: "B",
};

async function extractNotesFromImage(imageBuffer: Buffer): Promise<ExtractedNote[]> {
    try {
        // DOCUMENT_TEXT_DETECTION을 사용하여 더 나은 문서 처리
        const [result] = await visionClient.documentTextDetection({
            image: { content: imageBuffer },
            imageContext: {
                languageHints: ["ko", "en"],
            },
        });

        const fullTextAnnotation = result.fullTextAnnotation;
        if (!fullTextAnnotation) {
            return [];
        }

        const notes: ExtractedNote[] = [];
        let currentMeasure = 1;
        let currentBeat = 1;

        // 페이지 단위로 처리
        for (const page of fullTextAnnotation.pages || []) {
            // 블록 단위로 텍스트 그룹화
            for (const block of page.blocks || []) {
                for (const paragraph of block.paragraphs || []) {
                    for (const word of paragraph.words || []) {
                        let wordText = "";
                        for (const symbol of word.symbols || []) {
                            wordText += symbol.text || "";
                        }

                        // 음표 기호 확인
                        if (NOTE_SYMBOLS[wordText]) {
                            const y = block.boundingBox?.vertices?.[0]?.y || 0;
                            const pitch = calculatePitchFromPosition(y);

                            notes.push({
                                pitch: pitch.note,
                                octave: pitch.octave,
                                duration: NOTE_SYMBOLS[wordText],
                                measure: currentMeasure,
                                beat: currentBeat,
                                confidence: block.confidence || 0.8,
                            });

                            currentBeat += getDurationValue(NOTE_SYMBOLS[wordText]);
                            if (currentBeat > 4) {
                                currentMeasure++;
                                currentBeat = 1;
                            }
                        }

                        // 음표 이름 확인 (도, 레, 미 등)
                        if (NOTE_NAMES[wordText]) {
                            const y = block.boundingBox?.vertices?.[0]?.y || 0;
                            const octave = calculateOctaveFromPosition(y);

                            notes.push({
                                pitch: NOTE_NAMES[wordText],
                                octave: octave,
                                duration: "quarter", // 기본값
                                measure: currentMeasure,
                                beat: currentBeat,
                                confidence: block.confidence || 0.7,
                            });

                            currentBeat++;
                            if (currentBeat > 4) {
                                currentMeasure++;
                                currentBeat = 1;
                            }
                        }
                    }
                }
            }
        }

        return notes;
    } catch (error) {
        console.error("음표 추출 중 오류:", error);
        throw error;
    }
}

// 음표의 y좌표를 기반으로 음높이와 옥타브 계산
function calculatePitchFromPosition(y: number): { note: string; octave: number } {
    // 오선의 위치를 기반으로 음높이 계산 (실제로는 더 정교한 알고리즘 필요)
    const lineHeight = 20; // 오선 간격 추정
    const staffPosition = Math.floor(y / lineHeight) % 7;

    const pitches = ["C", "D", "E", "F", "G", "A", "B"];
    const note = pitches[staffPosition] || "C";
    const octave = Math.floor(y / (lineHeight * 7)) + 4; // 4옥타브를 기준으로

    return { note, octave: Math.max(3, Math.min(7, octave)) };
}

// y좌표를 기반으로 옥타브 계산
function calculateOctaveFromPosition(y: number): number {
    // 간단한 추정 로직
    const baseOctave = 4;
    const octaveShift = Math.floor((y - 200) / 100); // 200px를 기준으로
    return Math.max(3, Math.min(7, baseOctave + octaveShift));
}

// 음표 종류에 따른 박자 값
function getDurationValue(noteType: string): number {
    const durations: { [key: string]: number } = {
        whole: 4,
        half: 2,
        quarter: 1,
        eighth: 0.5,
        sixteenth: 0.25,
    };
    return durations[noteType] || 1;
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    try {
        const formData = await request.formData();
        const image = formData.get("image") as File;

        if (!image) {
            return new Response(JSON.stringify({ error: "이미지가 제공되지 않았습니다." }), {
                status: 400,
            });
        }

        // 이미지를 버퍼로 변환
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 이미지에서 음표 추출
        const notes = await extractNotesFromImage(buffer);

        return new Response(
            JSON.stringify({
                notes,
                success: true,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("음표 추출 중 오류:", error);
        return new Response(
            JSON.stringify({
                error: "음표 추출 중 오류가 발생했습니다.",
                details: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
