"use server";

import { ActionApiResponse } from "@utils";
import { xprisma } from "@nx-web/db";
import { z } from "zod";
import { authorizedAction } from "@web/lib/actions";

const sendMessageSchema = z.object({
   subject: z.string(), message: z.string(), userId: z.string(),
});

export const sendMessage = authorizedAction(sendMessageSchema, async ({
                                                                   message,
                                                                   subject,
                                                                   userId,
                                                                }, { userId: senderId }): Promise<ActionApiResponse> => {
   const recipient = await xprisma.user.findUnique({ where: { id: userId } });
   if (!recipient) return { success: false };

   const dbMessage = await xprisma.message.create({
      data: {
         recipientId: recipient.id,
         senderId,
         text: message,
         subject,
      },
   });

   return { success: true, data: dbMessage };
});
