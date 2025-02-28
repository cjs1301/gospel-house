// API 응답 타입 정의
interface MinistryNotice {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface MinistrySchedule {
    id: string;
    date: string;
    position: string;
    status: string;
    user: {
        name: string | null;
        image: string | null;
    };
}

// 공지사항 관련 API
export async function getMinistryNotices(ministryId: string): Promise<MinistryNotice[]> {
    const res = await fetch(`/api/ministry/notice?ministryId=${ministryId}`);
    if (!res.ok) throw new Error("Failed to fetch notices");
    return res.json();
}

export async function createMinistryNotice(data: {
    ministryId: string;
    title: string;
    content: string;
}) {
    const res = await fetch("/api/ministry/notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create notice");
    return res.json();
}

// 일정 관련 API
export async function getMinistrySchedules(ministryId: string): Promise<MinistrySchedule[]> {
    const res = await fetch(`/api/ministry/schedule?ministryId=${ministryId}`);
    if (!res.ok) throw new Error("Failed to fetch schedules");
    return res.json();
}

export async function createMinistrySchedule(data: {
    ministryId: string;
    date: string;
    position: string;
}) {
    const res = await fetch("/api/ministry/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create schedule");
    return res.json();
}

// 사역팀 가입 신청 API
export async function joinMinistry(ministryId: string) {
    const res = await fetch("/api/ministry/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ministryId }),
    });
    if (!res.ok) throw new Error("Failed to join ministry");
    return res.json();
}
