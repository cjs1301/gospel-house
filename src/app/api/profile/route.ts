import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json(null);
    }

    const userMinistries = await prisma.ministryMember.findMany({
        where: { userId: session.user.id },
        include: { ministry: true },
    });

    return NextResponse.json({
        user: session.user,
        ministries: userMinistries.map((member) => ({
            id: member.ministry.id,
            name: member.ministry.name,
            role: member.role,
            isLeader: member.role === "ADMIN",
        })),
    });
}
