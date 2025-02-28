import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // 기존 데이터 삭제
    await prisma.ministry.deleteMany({
        where: {
            churchId: "jdyouth",
        },
    });

    // 정동젊은이교회 데이터 생성
    const church = await prisma.church.upsert({
        where: {
            id: "jdyouth",
        },
        update: {
            name: "정동젊은이교회",
            address: "서울특별시 중구 정동길 26",
            description: "정동제일교회 젊은이교회",
        },
        create: {
            id: "jdyouth",
            name: "정동젊은이교회",
            address: "서울특별시 중구 정동길 26",
            description: "정동제일교회 젊은이교회",
        },
    });

    // 사역팀 생성
    const ministries = await prisma.ministry.createMany({
        data: [
            {
                name: "위싱",
                description: "정동젊은이교회 찬양팀",
                churchId: church.id,
            },
            {
                name: "소통",
                description: "정동젊은이교회 예배 진행팀",
                churchId: church.id,
            },
            {
                name: "하랑",
                description: "정동젊은이교회 봉사활동팀",
                churchId: church.id,
            },
        ],
    });

    console.log({ church, ministries });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
