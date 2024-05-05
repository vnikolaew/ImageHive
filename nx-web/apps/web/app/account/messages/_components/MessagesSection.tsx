"use client";
import { TabsContent } from "@components/tabs";
import React, { useMemo, useState } from "react";
import { Message } from "@prisma/client";
import MessageEntry from "./MessageEntry";
import { Button } from "@components/button";
import { usePromise } from "@web/hooks/usePromise";
import {
   handleDeleteMessages,
   handleMarkMessagesAsRead,
   handleMarkMessagesAsUnread,
} from "@web/app/account/messages/actions";
import { toast } from "sonner";

export interface MessagesSectionProps {
   outbox: Message[];
}

const MessagesSection = ({ outbox }: MessagesSectionProps) => {
   const [markedEntries, setMarkedEntries] = useState<string[]>([]);
   const { action: markReadAction, loading } = usePromise(async () => {
      const res = await handleMarkMessagesAsRead(markedEntries);
      console.log({ res });
      if (res.success) {
         toast(`success`);
      } else toast(`error`);
   });

   const { action: markUnreadAction, loading: unreadLoading } = usePromise(async () => {
      const res = await handleMarkMessagesAsUnread(markedEntries);
      console.log({ res });
      if (res.success) {
         toast(`success`);
      } else toast(`error`);
   });
   const { action: deleteMessagesAction, loading: deleteLoading } = usePromise(async () => {
      const res = await handleDeleteMessages(markedEntries);
      console.log({ res });
      if (res.success) {
         toast(`success`);
      } else toast(`error`);
   });

   const disableButtons = useMemo(() => {
      return markedEntries.length === 0 || loading || unreadLoading || deleteLoading;
   }, [markedEntries, loading, unreadLoading, deleteLoading]);

   return (
      <TabsContent className={`flex flex-col gap-4 w-full`} value={`outbox`}>
         <div className={`w-full flex items-center gap-2`}>
            <Button
               disabled={disableButtons} size={`sm`} className={`rounded-full`}
               onClick={deleteMessagesAction}
               variant={`secondary`}>
               Delete {!!markedEntries.length && `(${markedEntries.length})`}
            </Button>
            <Button
               onClick={markReadAction}
               disabled={disableButtons}
               size={`sm`} className={`rounded-full`}
               variant={`secondary`}>
               Mark as read {!!markedEntries.length && `(${markedEntries.length})`}
            </Button>
            <Button
               onClick={markUnreadAction}
               disabled={disableButtons} size={`sm`} className={`rounded-full`} variant={`secondary`}>
               Mark as unread {!!markedEntries.length && `(${markedEntries.length})`}
            </Button>
         </div>
         {outbox.map((message, i) => (
            <MessageEntry
               onMarkChange={value => {
                  if (value) setMarkedEntries(e => [...e, message.id]);
                  else setMarkedEntries(e => e.filter(x => x !== message.id));
               }} key={i}
               message={message} />
         ))}
      </TabsContent>
   );
};

export default MessagesSection;
