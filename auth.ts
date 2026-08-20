import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.hashedPassword);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      // user есть только в момент логина (когда authorize() вернул объект).
      // Кладём id/username в токен, чтобы они "пережили" JWT между запросами
      // без похода в БД на каждый запрос (см. (main)/layout.tsx).
      if (user) {
        token.id = user.id;
        if (user.username) token.username = user.username;
      }
      return token;
    },
    session: ({ session, token }) => {
      // На каждый запрос токен декодируется — переносим данные из токена в session.user
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      return session;
    },
    authorized: ({ auth, request: { nextUrl } }) => {
      const isLoggedIn = !!auth?.user;
      const isProtected = nextUrl.pathname.startsWith("/dashboard");
      if (isProtected && !isLoggedIn) return false; // редиректнёт на страницу логина
      return true;
    },
  },
});
