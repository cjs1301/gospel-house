import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_BUCKET_NAME } from "@/lib/s3";
import crypto from "crypto";

// 허용된 도메인 목록
const ALLOWED_ORIGINS = ["http://localhost:3000", "https://gospel-house.vercel.app"];

// 요청 출처 확인 함수
function isAllowedOrigin(request: NextRequest) {
    const origin = request.headers.get("origin");
    return origin ? ALLOWED_ORIGINS.includes(origin) : false;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 출처 확인
        if (!isAllowedOrigin(request)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id }: { id: string } = await params;
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

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file provided", { status: 400 });
        }

        // 파일 확장자 확인
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        const allowedExtensions = [
            "pdf",
            "doc",
            "docx",
            "xls",
            "xlsx",
            "ppt",
            "pptx",
            "txt",
            "jpg",
            "jpeg",
            "png",
        ];

        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            return new NextResponse("Invalid file type", { status: 400 });
        }

        // 파일 크기 제한 (10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            return new NextResponse("File too large. Maximum size is 10MB", { status: 400 });
        }

        // 고유한 파일 이름 생성
        const uniqueId = crypto.randomBytes(16).toString("hex");
        const key = `ministries/${id}/${uniqueId}-${file.name}`;

        // 파일을 ArrayBuffer로 변환
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // S3에 파일 업로드
        const command = new PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            ContentDisposition: "attachment",
            Metadata: {
                "ministry-id": id,
                "uploaded-by": session.user.id,
            },
        });

        await s3Client.send(command);

        // 서명된 URL 생성 (24시간 유효)
        const getObjectCommand = new GetObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: key,
        });
        const signedUrl = await getSignedUrl(s3Client, getObjectCommand, { expiresIn: 86400 });

        // DB에 파일 정보 저장
        const savedFile = await prisma.ministryFile.create({
            data: {
                name: file.name,
                url: signedUrl,
                type: file.type,
                size: file.size,
                ministryId: id,
                uploadedById: session.user.id,
            },
        });

        return NextResponse.json(savedFile);
    } catch (error) {
        console.error("[MINISTRY_FILE_UPLOAD]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // 출처 확인
        if (!isAllowedOrigin(request)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id }: { id: string } = await params;
        // 사역팀 멤버인지 확인
        const member = await prisma.ministryMember.findFirst({
            where: {
                ministryId: id,
                userId: session.user.id,
            },
        });

        if (!member) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const files = await prisma.ministryFile.findMany({
            where: {
                ministryId: id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // 각 파일에 대해 새로운 서명된 URL 생성
        const filesWithSignedUrls = await Promise.all(
            files.map(async (file) => {
                const key = file.url.split(".com/")[1]; // S3 URL에서 키 추출
                const command = new GetObjectCommand({
                    Bucket: S3_BUCKET_NAME,
                    Key: key,
                });
                const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
                return {
                    ...file,
                    url: signedUrl,
                };
            })
        );

        return NextResponse.json(filesWithSignedUrls);
    } catch (error) {
        console.error("[MINISTRY_FILES_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
