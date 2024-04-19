import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { constants } from "node:http2";
import { prisma } from "@/lib/prisma";
import { ImageHiveApiResponse } from "@/lib/utils";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { User } from "@prisma/client";

const requestSchema = z.object({
   email: z.string().email({ message: `Please enter valid e-mail address.` }),
});

async function sendResetEmailAsync(user: User, user_token: string): Promise<void> {
   const url = `${process.env.BASE_URL}/reset/${user.id}?token=${encodeURIComponent(user_token)}`;
   const resend = new Resend(process.env.AUTH_RESEND_KEY!);

   await resend.emails.send({
      from: `onboarding@resend.dev`,
      to: user.email,
      subject: "Password Reset Link for your Account",
      html: "<p>Click the link below to reset your account password:</p>\
             <p><a href=\"" + url + "\"><b>Reset</b></a></p>",
   });
}

export async function POST(req: NextRequest, res: NextResponse) {
   const body = await req.json();
   const parsedBody = requestSchema.safeParse(body);
   if (!parsedBody.success) {
      return NextResponse.json({
         success: false,
         message: `Invalid body.`,
      }, { status: constants.HTTP_STATUS_BAD_REQUEST });
   }

   const { email } = parsedBody.data;
   const user = await prisma.user.findFirst({
      where: { email },
      include: { images: true },
   });

   if (!user) {
      return ImageHiveApiResponse.badRequest({
         success: false,
         message: `User not found.`,
      });
   }

   try {
      // Generate a reset token and send an e-mail:
      const user_token = jwt.sign({ data: user.id }, process.env.RESET_TOKEN_SECRET!, {
         expiresIn: 60 * 60 * 10,
      });

      let account = await prisma.account.findFirst({
         where: { userId: user.id },
      });
      if (account) {
         account = await prisma.account.update({
            where: {
               provider_providerAccountId: {
                  providerAccountId: account.providerAccountId,
                  provider: account.provider,
               },
            },
            data: {
               metadata: { reset_token: user_token },
            },
         });
      }

      return ImageHiveApiResponse.success({
         user,
         account
      });
   } catch (err: any) {
      return ImageHiveApiResponse.badRequest({
         success: false,
         message: err.message,
      });

   }
}