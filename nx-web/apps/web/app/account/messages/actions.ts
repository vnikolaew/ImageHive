"use server";

import { xprisma } from "@nx-web/db";
import { ActionApiResponse } from "@utils";
import { z } from "zod";
import { authorizedAction } from "@web/lib/actions";

const markReadSchema = z.array(z.string());

export const handleMarkMessagesAsRead = authorizedAction(markReadSchema, async (messageIds: string[], { userId }): Promise<ActionApiResponse> => {
   const messages = await xprisma.message.findMany({
      where: {
         id: {
            in: messageIds,
         },
      },
   });

   const res = await xprisma.$transaction(
      messages.map((message) => xprisma.message.update({
         where: { id: message.id },
         data: {
            metadata: {
               ...(message.metadata as Record<string, any> ?? {}),
               read: true,
            },
         },
      })),
   );

   return { success: true, data: res };
});

export const handleMarkMessagesAsUnread = authorizedAction(markReadSchema, async (messageIds: string[], { userId }): Promise<ActionApiResponse> => {
   const messages = await xprisma.message.findMany({
      where: {
         id: {
            in: messageIds,
         },
      },
   });

   const res = await xprisma.$transaction(
      messages.map((message) => xprisma.message.update({
         where: { id: message.id },
         data: {
            metadata: {
               ...(message.metadata as Record<string, any> ?? {}),
               read: false,
            },
         },
      })),
   );

   return { success: true, data: res };
});


export const handleDeleteMessages = authorizedAction(markReadSchema, async (messageIds: string[], { userId }): Promise<ActionApiResponse> => {
   let messages = await xprisma.message.findMany({
      where: {
         id: { in: messageIds },
         senderId: userId,
      },
   });
   if (!messages?.length) return { success: false };

   let { count } = await xprisma.message.deleteMany({
      where: { id: { in: messages.map(m => m.id) } },
   });

   return { success: true, data: { count } };
});
