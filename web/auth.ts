import NextAuth from "next-auth";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, globalForPrisma, xprisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { session } from "@/lib/session";
import ResendProvider from "next-auth/providers/resend";
import { Resend } from "resend";
import Credentials from "next-auth/providers/credentials";

globalForPrisma.prisma ??= new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
   adapter: PrismaAdapter(prisma),
   debug: false,
   callbacks: {
      session,
      async authorized({ request, auth }) {
         return true;
      },
      async signIn({ user, profile, account, email }) {
         return true;

      },
      async jwt({ token, user, session, profile, account }) {
         if (user?.id) token.id = user.id;

         return token;
      },
   },
   session: { strategy: `jwt` },
   secret: process.env.AUTH_SECRET ?? `sdfsdfdsfwerwe`,
   providers: [Google, ResendProvider({
      from: `onboarding@resend.dev`,
      generateVerificationToken() {
         return crypto.randomUUID();
      },
      async sendVerificationRequest({ request, url, identifier, provider, token }) {
         try {
            console.log({ url, identifier, provider, token, request });

            const resend = new Resend(process.env.AUTH_RESEND_KEY!);
            await resend.emails.send({
               from: provider.from,
               to: identifier,
               subject: "Login Link to your Account",
               html: "<p>Click the magic link below to sign in to your account:</p>\
             <p><a href=\"" + url + "\"><b>Sign in</b></a></p>",
            });
         } catch (error) {
            console.log({ error });
         }
      },
   }),
      Credentials({
            credentials: {
               email: {
                  type: "email",
               },
               username: {
                  type: "text",
               },
               password: {
                  type: "password",
               },
               type: {
                  type: "text",
               },
            },
            authorize: async ({ username, email, password, type }) => {
               if (type === `signup`) {
                  // Handle user sign up:
                  const existing = await xprisma.user.findFirst({
                     where: {
                        OR: [
                           {
                              email: email as string,
                           },
                           {
                              name: username as string,
                           },
                        ],
                     },
                  });
                  if (existing) return null!;

                  const user = await xprisma.user.signUp({
                     email: email as string,
                     password: password as string,
                     username: username as string,
                  }, { image: true });

                  return {
                     id: user.id,
                     email: user.email,
                     name: user.name,
                     image: user.image,
                  };
               }

               const user = await xprisma.user.signIn({
                  email: email as string,
                  password: password as string,
                  username: username as string,
               });

               return user!;
            },
         },
      )],
});