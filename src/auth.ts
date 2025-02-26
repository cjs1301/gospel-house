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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;

                // 유저가 교회를 선택했는지 확인
                const churchMember = await prisma.churchMember.findFirst({
                    where: { userId: user.id },
                });
                token.hasChurch = !!churchMember;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.hasChurch = token.hasChurch as boolean;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    ...authConfig,
});
