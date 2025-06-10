import type { NextAuthConfig } from "next-auth";
import Kakao from "next-auth/providers/kakao";

if (!process.env.AUTH_KAKAO_ID) {
    throw new Error("KAKAO_CLIENT_ID is not defined");
}

if (!process.env.AUTH_KAKAO_SECRET) {
    throw new Error("KAKAO_CLIENT_SECRET is not defined");
}

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        Kakao({
            clientId: process.env.AUTH_KAKAO_ID,
            clientSecret: process.env.AUTH_KAKAO_SECRET,
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
    session: {
        strategy: "jwt",
        maxAge: 1 * 60 * 60, // 1 hour
    },
    callbacks: {
        async jwt({ token, trigger, session, user, account }) {
            // console.log('jwt!', token);

            if (user) {
                token = { ...token, ...user, provider: account?.provider };
            }
            if (trigger === "update") {
                // console.log('update!', session.user);
                token = { ...token, ...session.user };
                // console.log('token!', token);
            }
            // console.log('token!', token);
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.hasChurch = token.hasChurch as boolean;
            }
            return session;
        },
        authorized: async ({ auth }) => {
            return !!auth;
        },
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;
