import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { churchId, name } = body;

        if (!churchId) {
            return new NextResponse("Church ID is required", { status: 400 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Check if church exists
        const church = await prisma.church.findUnique({
            where: { id: churchId },
        });

        if (!church) {
            return new NextResponse("Church not found", { status: 404 });
        }

        // Check if user is already a member of any church
        const existingMembership = await prisma.churchMember.findFirst({
            where: { userId: session.user.id },
        });

        if (existingMembership) {
            return new NextResponse("User is already a member of a church", { status: 400 });
        }

        // Start a transaction to update both user and create church member
        const result = await prisma.$transaction(async (tx) => {
            // Update user name
            const updatedUser = await tx.user.update({
                where: { id: session.user.id },
                data: { name },
            });

            // Create church member with PENDING status
            const churchMember = await tx.churchMember.create({
                data: {
                    userId: session.user.id,
                    churchId,
                    role: "PENDING",
                },
                include: {
                    church: true,
                },
            });

            return {
                user: updatedUser,
                churchMember,
            };
        });

        return NextResponse.json(result);
    } catch (error) {
        // 에러 로깅 개선
        console.error(
            "[CHURCH_JOIN] Error:",
            error instanceof Error ? error.message : "Unknown error"
        );

        if (error instanceof Error) {
            return new NextResponse(error.message, { status: 500 });
        }
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
