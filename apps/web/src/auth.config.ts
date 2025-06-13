import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        // Kakao({
        //     clientId: process.env.AUTH_KAKAO_ID,
        //     clientSecret: process.env.AUTH_KAKAO_SECRET,
        // }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code",
                },
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
        // authorized: async ({ auth }) => {
        //     return !!auth;
        // },
    },
    pages: {
        signIn: "/login",
    },
    // debug: true,
} satisfies NextAuthConfig;
