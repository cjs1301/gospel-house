import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, user }) {
            // Add user ID to the session
            if (session.user) {
                session.user.id = user.id;
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
});
