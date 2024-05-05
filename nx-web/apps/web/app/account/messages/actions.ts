"use server";

import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import { ActionApiResponse } from "@utils";

export async function handleMarkMessagesAsRead(messageIds: string[]): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

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
}

export async function handleMarkMessagesAsUnread(messageIds: string[]): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

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
}


export async function handleDeleteMessages(messageIds: string[]): Promise<ActionApiResponse> {
   const session = await auth();
   if (!session) return { success: false };

   let messages = await xprisma.message.findMany({
      where: {
         id: { in: messageIds },
         senderId: session.user?.id as string,
      },
   });
   if (!messages?.length) return { success: false };

   let { count } = await xprisma.message.deleteMany({
      where: { id: { in: messages.map(m => m.id) } },
   });

   return { success: true, data: { count } };
}
