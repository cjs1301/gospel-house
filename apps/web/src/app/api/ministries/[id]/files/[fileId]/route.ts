import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; fileId: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { id, fileId }: { id: string; fileId: string } = await params;
        // 사역팀 리더 권한 확인
        const member = await prisma.ministryMember.findFirst({
            where: {
                ministryId: id,
                userId: session.user.id,
                role: "ADMIN",
            },
        });

        if (!member) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        // 파일이 해당 사역팀의 것인지 확인
        const file = await prisma.ministryFile.findFirst({
            where: {
                id: fileId,
                ministryId: id,
            },
        });

        if (!file) {
            return new NextResponse("File not found", { status: 404 });
        }

        // TODO: 실제 파일 삭제 구현
        // 스토리지 서비스에서 파일 삭제

        // DB에서 파일 정보 삭제
        await prisma.ministryFile.delete({
            where: {
                id: fileId,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[MINISTRY_FILE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
