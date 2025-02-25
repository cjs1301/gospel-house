import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import authConfig from "@/auth.config";
export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
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
    ...authConfig,
});
