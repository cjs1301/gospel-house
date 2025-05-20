import type { NextAuthConfig } from "next-auth";
import Kakao from "next-auth/providers/kakao";

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        Kakao({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.properties?.nickname ?? null,
                    email: profile.kakao_account?.email ?? null,
                    image: profile.properties?.profile_image ?? null,
                };
            },
        }),
    ],
} satisfies NextAuthConfig;
