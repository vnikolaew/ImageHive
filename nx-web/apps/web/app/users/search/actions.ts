"use server";

import { auth } from "@web/auth";
import { ActionApiResponse } from "@utils";
import { xprisma } from "@nx-web/db";

export async function sendMessage(subject: string, message: string, userId: string): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   const recipient = await xprisma.user.findUnique({ where: { id: userId } });
   if (!recipient) return { success: false };

   const dbMessage = await xprisma.message.create({
      data: {
         recipientId: recipient.id,
         senderId: session.user?.id,
         text: message,
         subject,
      },
   });
   return { success: true, data: dbMessage };
}
