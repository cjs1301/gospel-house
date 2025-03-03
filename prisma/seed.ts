import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        // 정동젊은이교회 데이터 생성
        const church = await prisma.church.upsert({
            where: {
                id: "jdyouth",
            },
            update: {
                name: "정동젊은이교회",
                address: "서울특별시 중구 정동길 26",
                description: "정동제일교회 젊은이교회",
                image: "/churches/jdyouth.png",
                instagram: "https://www.instagram.com/jdyouth",
                youtube: "https://www.youtube.com/@jdyouth",
                homepage: "https://www.jdyouth.org",
            },
            create: {
                id: "jdyouth",
                name: "정동젊은이교회",
                address: "서울특별시 중구 정동길 26",
                description: "정동제일교회 젊은이교회",
                image: "/churches/jdyouth.png",
                instagram: "https://www.instagram.com/jdyouth",
                youtube: "https://www.youtube.com/@jdyouth",
                homepage: "https://www.jdyouth.org",
            },
        });

        // 테스트 유저 생성 (고정 ID 사용)
        const testUsers = await Promise.all([
            prisma.user.upsert({
                where: { id: "test-admin" },
                update: { name: "관리자" },
                create: {
                    id: "test-admin",
                    name: "관리자",
                },
            }),
            prisma.user.upsert({
                where: { id: "test-user1" },
                update: { name: "홍길동" },
                create: {
                    id: "test-user1",
                    name: "홍길동",
                },
            }),
            prisma.user.upsert({
                where: { id: "test-user2" },
                update: { name: "김철수" },
                create: {
                    id: "test-user2",
                    name: "김철수",
                },
            }),
        ]);

        // 교회 멤버 생성
        await Promise.all(
            testUsers.map((user) =>
                prisma.churchMember.upsert({
                    where: {
                        userId_churchId: {
                            userId: user.id,
                            churchId: church.id,
                        },
                    },
                    update: {
                        role: user.id === "test-admin" ? "ADMIN" : "MEMBER",
                    },
                    create: {
                        userId: user.id,
                        churchId: church.id,
                        role: user.id === "test-admin" ? "ADMIN" : "MEMBER",
                    },
                })
            )
        );

        // 기존 사역팀 데이터가 있다면 삭제
        await prisma.ministry.deleteMany({
            where: { churchId: church.id },
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

        // 사역팀 ID 가져오기
        const ministryWorship = await prisma.ministry.findFirst({
            where: { name: "위싱" },
        });

        if (ministryWorship) {
            // 사역팀 공지사항 생성
            await prisma.ministryNotice.create({
                data: {
                    title: "4월 로테이션 투표 안내",
                    content: `안녕하세요, 위싱팀원 여러분!

4월 로테이션 투표를 시작합니다.
아래 링크에서 참여 가능한 날짜를 체크해주세요.

투표 링크: https://example.com/vote
투표 기한: ~ 3월 25일까지

많은 참여 부탁드립니다. 🙏`,
                    ministryId: ministryWorship.id,
                    userId: testUsers[0].id, // 관리자가 작성
                    startDate: new Date("2025-03-15"),
                    endDate: new Date("2025-03-25"),
                    createdAt: new Date("2025-03-15T10:00:00Z"),
                },
            });

            // 오프라인 모임 공지와 이벤트 생성
            const offlineNotice = await prisma.ministryNotice.create({
                data: {
                    title: "3월 오프라인 정기 모임 안내",
                    content: `3월 정기 모임 일정을 안내드립니다.

주요 안건: 
1. 새로운 곡 선곡 회의
2. 분기별 예배 계획 논의
3. 악기 점검 및 관리 방안

간단한 다과가 준비될 예정입니다.
모든 팀원분들의 참석 부탁드립니다! 🎵`,
                    ministryId: ministryWorship.id,
                    userId: testUsers[0].id,
                    startDate: new Date("2025-03-01"),
                    endDate: new Date("2025-03-08"),
                    createdAt: new Date("2025-03-01T09:00:00Z"),
                    events: {
                        create: {
                            title: "3월 정기 모임",
                            description:
                                "3월 정기 모임입니다. 악기 점검이 있으니 악기 지참 부탁드립니다.",
                            location: "정동젊은이교회 3층 위싱팀 연습실",
                            eventDate: new Date("2025-03-08"),
                            startTime: new Date("2025-03-08T19:00:00Z"),
                            endTime: new Date("2025-03-08T21:00:00Z"),
                            maxAttendees: 20,
                        },
                    },
                },
            });
        }

        // 교회 피드 생성
        const feeds = await Promise.all([
            prisma.churchFeed.create({
                data: {
                    content:
                        "이번 주일 청년부 예배 찬양팀 사진입니다! 함께 예배드린 모든 분들께 감사드립니다. 🙏",
                    churchId: church.id,
                    authorId: testUsers[0].id,
                    images: {
                        create: [
                            {
                                url: "https://images.unsplash.com/photo-1508695666381-69deeaa78ccb",
                                order: 1,
                            },
                        ],
                    },
                },
            }),
            prisma.churchFeed.create({
                data: {
                    content:
                        "청년부 봉사활동 - 지역 사회를 위한 환경 정화 활동을 진행했습니다. 다음에도 많은 참여 부탁드립니다! 💚",
                    churchId: church.id,
                    authorId: testUsers[1].id,
                    images: {
                        create: [
                            {
                                url: "https://images.unsplash.com/photo-1593113598332-cd288d649433",
                                order: 1,
                            },
                        ],
                    },
                },
            }),
            prisma.churchFeed.create({
                data: {
                    content:
                        "청년부 여름 수련회 준비 모임 진행했습니다. 은혜로운 수련회가 될 수 있도록 기도해주세요! ✨",
                    churchId: church.id,
                    authorId: testUsers[2].id,
                    images: {
                        create: [
                            {
                                url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18",
                                order: 1,
                            },
                        ],
                    },
                },
            }),
        ]);

        // 좋아요와 댓글 추가
        await Promise.all([
            // 첫 번째 피드에 대한 좋아요와 댓글
            prisma.feedLike.createMany({
                data: [
                    { feedId: feeds[0].id, userId: testUsers[1].id },
                    { feedId: feeds[0].id, userId: testUsers[2].id },
                ],
            }),
            prisma.feedComment.create({
                data: {
                    content: "찬양팀 은혜가 넘치네요! 👏",
                    feedId: feeds[0].id,
                    userId: testUsers[1].id,
                },
            }),

            // 두 번째 피드에 대한 좋아요와 댓글
            prisma.feedLike.create({
                data: { feedId: feeds[1].id, userId: testUsers[0].id },
            }),
            prisma.feedComment.createMany({
                data: [
                    {
                        content: "다음에는 저도 참여할게요!",
                        feedId: feeds[1].id,
                        userId: testUsers[2].id,
                    },
                    {
                        content: "좋은 활동이었습니다 😊",
                        feedId: feeds[1].id,
                        userId: testUsers[0].id,
                    },
                ],
            }),

            // 세 번째 피드에 대한 좋아요
            prisma.feedLike.createMany({
                data: [
                    { feedId: feeds[2].id, userId: testUsers[0].id },
                    { feedId: feeds[2].id, userId: testUsers[1].id },
                ],
            }),
        ]);

        console.log("Seed data created successfully");
    } catch (error) {
        console.error("Error seeding data:", error);
        throw error;
    }
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
