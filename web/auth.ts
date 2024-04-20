import NextAuth from "next-auth";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, globalForPrisma } from "@/lib/prisma";
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
               }, password: {
                  type: "password",
               },
            },
            authorize: async ({ email, password }) => {
               console.log({ email, password });
               const user = await prisma.user.findUnique({
                  where: { email: email as string },
               });
               if (user) {
                  return {
                     id: user.id,
                     email: user.email,
                     name: user.name,
                     image: user.image,
                  };
               }
               return null!;
            },
         },
      )],
});