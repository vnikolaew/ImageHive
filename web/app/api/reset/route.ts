import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { constants } from "node:http2";
import { xprisma } from "@/lib/prisma";
import { ImageHiveApiResponse } from "@/lib/utils";
import jwt from "jsonwebtoken";

const requestSchema = z.object({
   userId: z.string(),
   newPassword: z.string(),
   token: z.string(),
});

export async function POST(req: NextRequest, res: NextResponse) {
   const body = await req.json();
   const parsedBody = requestSchema.safeParse(body);

   if (!parsedBody.success) {
      return NextResponse.json({
         success: false,
         message: `Invalid body.`,
      }, { status: constants.HTTP_STATUS_BAD_REQUEST });
   }

   const { userId, newPassword, token } = parsedBody.data;
   const user = await xprisma.user.findFirst({
      where: { id: userId },
      include: { accounts: true },
   });

   if (!user) {
      return ImageHiveApiResponse.badRequest({
         success: false,
         message: `User not found.`,
      });
   }

   const success = user.accounts.some(a => a.metadata?.reset_token === token)
      && jwt.verify(token, process.env.RESET_TOKEN_SECRET!, {
         maxAge: 60 * 60 * 10,
      })?.data === user.id;
   if (!success) {
      return ImageHiveApiResponse.badRequest({
         success: false,
         message: `Invalid token.`,
      });
   }

   let newUser = await user.updatePassword(newPassword);
   let account = user.accounts.find(a => a.metadata?.reset_token === token);

   console.log({ account });

   const { reset_token, ...rest } = account!.metadata as Record<string, any>;
   let newAccount = await account?.deleteResetToken();
   console.log({ newAccount });

   return ImageHiveApiResponse.success({});
}
