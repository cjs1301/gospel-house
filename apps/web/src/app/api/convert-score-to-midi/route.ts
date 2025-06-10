import { NextRequest } from "next/server";
import { auth } from "@/auth";
import vision from "@google-cloud/vision";
import * as Tonal from "tonal";
import { Midi } from "@tonejs/midi";

// Google Cloud Vision 클라이언트 초기화
const visionClient = new vision.ImageAnnotatorClient({
    credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
    },
});

interface Note {
    pitch: string;
    duration: number;
    time: number;
}

// 음표 기호와 실제 음높이 매핑
const NOTE_SYMBOLS: { [key: string]: string } = {
    "♩": "quarter",
    "♪": "eighth",
    "𝅗𝅥": "whole",
    "𝅘𝅥": "quarter",
    "𝅘𝅥𝅮": "eighth",
    "𝅘𝅥𝅯": "sixteenth",
};

async function extractNotesFromImage(imageBuffer: Buffer): Promise<Note[]> {
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

        const notes: Note[] = [];
        let currentTime = 0;

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
                        const noteSymbol = NOTE_SYMBOLS[wordText];
                        if (noteSymbol) {
                            // 음표의 위치를 기반으로 음높이 추정
                            const y = block.boundingBox?.vertices?.[0]?.y || 0;
                            // 오선의 위치를 기반으로 음높이 계산 (예시)
                            const pitch = calculatePitch(y);

                            notes.push({
                                pitch,
                                duration: getDuration(noteSymbol),
                                time: currentTime,
                            });

                            currentTime += getDuration(noteSymbol);
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

// 음표의 y좌표를 기반으로 음높이 계산 (예시 구현)
function calculatePitch(y: number): string {
    // 오선의 위치를 기반으로 음높이 계산
    // 실제 구현에서는 더 정교한 알고리즘 필요
    const pitches = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
    const index = Math.floor((y % 100) / (100 / pitches.length));
    return pitches[index] || "C4";
}

// 음표 종류에 따른 지속 시간 계산
function getDuration(noteType: string): number {
    const durations: { [key: string]: number } = {
        whole: 4,
        half: 2,
        quarter: 1,
        eighth: 0.5,
        sixteenth: 0.25,
    };
    return durations[noteType] || 1;
}

// 키 변경 함수
function transposeNotes(notes: Note[], fromKey: string, toKey: string): Note[] {
    const semitones = Tonal.Interval.semitones(Tonal.distance(fromKey, toKey));

    return notes.map((note) => ({
        ...note,
        pitch: Tonal.Note.transpose(note.pitch, Tonal.Interval.fromSemitones(semitones)),
    }));
}

// 노트 배열을 MIDI 파일로 변환
function createMidiFile(notes: Note[]): Uint8Array {
    const midi = new Midi();
    const track = midi.addTrack();

    notes.forEach((note) => {
        track.addNote({
            midi: Tonal.Note.midi(note.pitch) || 60,
            time: note.time,
            duration: note.duration,
        });
    });

    return midi.toArray();
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
        const currentKey = formData.get("currentKey") as string;
        const targetKey = formData.get("targetKey") as string;

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

        // 키 변경이 필요한 경우
        const transposedNotes =
            currentKey !== targetKey ? transposeNotes(notes, currentKey, targetKey) : notes;

        // MIDI 파일 생성
        const midiBuffer = createMidiFile(transposedNotes);

        // MIDI 파일을 Base64로 인코딩
        const midiBase64 = Buffer.from(midiBuffer).toString("base64");
        const midiUrl = `data:audio/midi;base64,${midiBase64}`;

        return new Response(
            JSON.stringify({
                midiUrl,
                notes: transposedNotes.map((note) => note.pitch),
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("악보 변환 중 오류:", error);
        return new Response(
            JSON.stringify({
                error: "악보 변환 중 오류가 발생했습니다.",
                details: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}
