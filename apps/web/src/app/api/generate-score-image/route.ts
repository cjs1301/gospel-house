import { NextRequest } from "next/server";
import { auth } from "@/auth";

interface NoteData {
    id: string;
    pitch: string;
    octave: number;
    duration: string;
    measure: number;
    beat: number;
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
        });
    }

    try {
        const body = await request.json();
        const { notes, key } = body as { notes: NoteData[]; key: string };

        if (!notes || notes.length === 0) {
            return new Response(JSON.stringify({ error: "음표가 제공되지 않았습니다." }), {
                status: 400,
            });
        }

        // 간단한 SVG 악보 생성
        const svg = generateScoreSVG(notes, key);

        // SVG를 base64 데이터 URL로 변환
        const svgBase64 = Buffer.from(svg).toString("base64");
        const imageUrl = `data:image/svg+xml;base64,${svgBase64}`;

        return new Response(
            JSON.stringify({
                imageUrl,
                success: true,
            }),
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("악보 생성 중 오류:", error);
        return new Response(
            JSON.stringify({
                error: "악보 생성 중 오류가 발생했습니다.",
                details: error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500 }
        );
    }
}

function generateScoreSVG(notes: NoteData[], key: string): string {
    const width = 800;
    const height = 600;
    const staffY = 200;
    const lineSpacing = 15;
    const noteSpacing = 60;

    // 음표 위치 계산
    const notePositions: { [key: string]: number } = {
        C: staffY + lineSpacing * 6, // 아래 추가선
        D: staffY + lineSpacing * 5.5,
        E: staffY + lineSpacing * 5, // 하단 선
        F: staffY + lineSpacing * 4.5,
        G: staffY + lineSpacing * 4, // 네 번째 선
        A: staffY + lineSpacing * 3.5,
        B: staffY + lineSpacing * 3, // 세 번째 선
    };

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    // 배경
    svg += `<rect width="${width}" height="${height}" fill="white"/>`;

    // 제목
    svg += `<text x="${width / 2}" y="50" text-anchor="middle" font-family="Arial" font-size="24" font-weight="bold">조바꿈된 악보 (${key})</text>`;

    // 오선 그리기
    for (let i = 0; i < 5; i++) {
        const y = staffY + i * lineSpacing;
        svg += `<line x1="50" y1="${y}" x2="${width - 50}" y2="${y}" stroke="black" stroke-width="1"/>`;
    }

    // 음자리표 (간단한 G 클레프 표시)
    svg += `<text x="70" y="${staffY + lineSpacing * 2}" font-family="Arial" font-size="40" font-weight="bold">𝄞</text>`;

    // 조표 표시
    svg += `<text x="120" y="${staffY - 20}" font-family="Arial" font-size="14" font-weight="bold">Key: ${key}</text>`;

    // 음표들 그리기
    let xPosition = 150;

    // 마디별로 그룹화
    const measureGroups: { [key: number]: NoteData[] } = {};
    notes.forEach((note) => {
        if (!measureGroups[note.measure]) {
            measureGroups[note.measure] = [];
        }
        measureGroups[note.measure].push(note);
    });

    Object.keys(measureGroups)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .forEach((measureNum) => {
            const measureNotes = measureGroups[parseInt(measureNum)];

            // 마디 시작 선
            if (parseInt(measureNum) > 1) {
                svg += `<line x1="${xPosition - 20}" y1="${staffY}" x2="${xPosition - 20}" y2="${staffY + lineSpacing * 4}" stroke="black" stroke-width="1"/>`;
            }

            // 마디 번호
            svg += `<text x="${xPosition - 10}" y="${staffY - 30}" font-family="Arial" font-size="12" fill="gray">${measureNum}</text>`;

            measureNotes.forEach((note) => {
                const baseY = notePositions[note.pitch] || staffY + lineSpacing * 2;
                const octaveOffset = (note.octave - 4) * lineSpacing * 3.5;
                const noteY = baseY - octaveOffset;

                // 음표 그리기 (동그라미로 간단히 표현)
                const noteSize = getDurationSize(note.duration);
                svg += `<circle cx="${xPosition}" cy="${noteY}" r="${noteSize}" fill="black"/>`;

                // 음표 줄기
                if (note.duration !== "whole") {
                    const stemHeight = lineSpacing * 3;
                    const stemY =
                        noteY < staffY + lineSpacing * 2 ? noteY + noteSize : noteY - noteSize;
                    const stemEndY =
                        noteY < staffY + lineSpacing * 2 ? stemY + stemHeight : stemY - stemHeight;
                    svg += `<line x1="${xPosition + (noteY < staffY + lineSpacing * 2 ? noteSize : -noteSize)}" y1="${stemY}" x2="${xPosition + (noteY < staffY + lineSpacing * 2 ? noteSize : -noteSize)}" y2="${stemEndY}" stroke="black" stroke-width="2"/>`;
                }

                // 추가선 (오선 밖의 음표용)
                if (noteY < staffY || noteY > staffY + lineSpacing * 4) {
                    const lineY = Math.round(noteY / lineSpacing) * lineSpacing;
                    svg += `<line x1="${xPosition - 15}" y1="${lineY}" x2="${xPosition + 15}" y2="${lineY}" stroke="black" stroke-width="1"/>`;
                }

                // 음표 이름 표시
                svg += `<text x="${xPosition}" y="${noteY + 25}" text-anchor="middle" font-family="Arial" font-size="10" fill="blue">${note.pitch}${note.octave}</text>`;

                xPosition += noteSpacing;
            });

            // 마디 끝 여백
            xPosition += 20;
        });

    // 악보 끝 선
    svg += `<line x1="${width - 50}" y1="${staffY}" x2="${width - 50}" y2="${staffY + lineSpacing * 4}" stroke="black" stroke-width="3"/>`;

    // 정보 표시
    svg += `<text x="50" y="${height - 50}" font-family="Arial" font-size="12" fill="gray">총 ${notes.length}개 음표, ${Object.keys(measureGroups).length}마디</text>`;

    svg += `</svg>`;

    return svg;
}

function getDurationSize(duration: string): number {
    const sizes: { [key: string]: number } = {
        whole: 8,
        half: 6,
        quarter: 5,
        eighth: 4,
        sixteenth: 3,
    };
    return sizes[duration] || 5;
}
