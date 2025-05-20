export interface MinistryFile {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    createdAt: string;
    ministryId: string;
    uploadedById: string;
}

export interface MinistryUser {
    name: string | null;
    image: string | null;
}

export interface MinistryPosition {
    id: string;
    name: string;
    description: string | null;
    maxMembers: number | null;
}

export interface MinistryEvent {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    eventDate: string;
    startTime: string;
    endTime: string;
    maxAttendees: number | null;
}

export interface MinistryNotice {
    id: string;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    user: MinistryUser;
    events: MinistryEvent[];
}

export interface MinistrySchedule {
    id: string;
    date: string;
    status: string;
    user: MinistryUser;
    position: MinistryPosition;
}

export interface MinistryMember {
    userId: string;
    role: "ADMIN" | "MEMBER" | "PENDING";
}

export interface Ministry {
    id: string;
    name: string;
    description: string | null;
    _count: {
        members: number;
    };
    members: MinistryMember[];
    positions: MinistryPosition[];
    notices: MinistryNotice[];
    schedules: MinistrySchedule[];
    files: {
        id: string;
        name: string;
        url: string;
        type: string;
        size: number;
        createdAt: string;
    }[];
}
