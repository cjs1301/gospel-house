import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // 정동젊은이교회 데이터 생성
    const church = await prisma.church.upsert({
        where: {
            id: "jdyouth",
        },
        update: {},
        create: {
            id: "jdyouth",
            name: "정동젊은이교회",
            address: "서울특별시 중구 정동길 26",
            description: "정동제일교회 젊은이교회",
        },
    });

    console.log({ church });
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
