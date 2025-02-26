import { DefaultSession } from "next-auth";

// JWT와 Session 타입 확장
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            hasChurch: boolean;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        hasChurch: boolean;
    }
}
