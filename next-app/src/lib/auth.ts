import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
  interface User {
    role: Role;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: `${profile.given_name}`,
          email: profile.email,
          emailVerified: true,
          role: Role.USER,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return {
          ...token,
          ...session.user,
        };
      }

      if (user) {
        if (user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            return {
              ...token,
              id: user.id,
              name: user.name,
              role: Role.USER,
            };
          }

          return {
            ...token,
            id: user.id,
            name: user.name,
            role: existingUser.role,
          };
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      };
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
