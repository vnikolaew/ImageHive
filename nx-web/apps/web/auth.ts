import NextAuth from "next-auth";
import Google from "@auth/core/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { session } from "./lib/session";
import ResendProvider from "next-auth/providers/resend";
import { Resend } from "resend";
import Credentials from "next-auth/providers/credentials";
import { globalForPrisma, prisma, xprisma } from "@nx-web/db";
import { APP_NAME, RESEND_ONBOARDING_EMAIL } from "@nx-web/shared";
import { WelcomeEmail } from "@nx-web/emails";
import crypto from 'crypto';

globalForPrisma.prisma ??= new PrismaClient();

const resend = new Resend(process!.env.AUTH_RESEND_KEY!);

export const { handlers, signIn, signOut, auth } = NextAuth({
   trustHost: true,
   adapter: PrismaAdapter(prisma),
   events: {
      createUser: async (user) => {
         console.log({ user });

         // Create user profile:
         const profile = await xprisma.profile.create({
            data: {
               user: { connect: { id: user.user.id } },
               about: ``, city: ``, country: ``,
               firstName: ``,
               lastName: ``,
               dateOfBirth: null!,
               gender: `UNSPECIFIED`,
            },
         });

         // Send a welcome e-mail:
         try {
            const { error, data } = await resend.emails.send({
               from: RESEND_ONBOARDING_EMAIL,
               to: user.user.email!,
               subject: `Welcome to ${APP_NAME}`,
               react: WelcomeEmail({ username: user.user.name! }),
            });
            console.log(`Welcome e-mail successfully sent to: ${user.user.email} with ID: ${data?.id}`);
         } catch (err) {
            console.error(`An error occurred while sending a Welcome e-mail to: ${user.user.email}: ${err}`);
         }
         console.log({ profile });
      },
   },
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
   providers: [Google({
      // profile: (profile, tokens) => {
      //    console.log({ profile });
      //    return profile;
      // },
   }), ResendProvider({
      from: RESEND_ONBOARDING_EMAIL,
      generateVerificationToken() {
         return crypto.randomUUID();
      },
      async sendVerificationRequest({ request, url, identifier, provider, token }) {
         try {
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
                           email: email as string,
                        },
                     })
                  ;
                  if (existing) return null!;

                  // Retrieve Gravatar image:
                  const imageUrl = ``;
                  //await getGravatarImageUrl(email as string);
                  const user = await xprisma.user.signUp({
                     email: email as string,
                     password: password as string,
                     username: username as string,
                     image: imageUrl,
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
