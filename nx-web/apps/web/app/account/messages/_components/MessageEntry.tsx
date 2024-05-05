"use client";
import React, { useState } from "react";
import { Message, User } from "@prisma/client";
import Image from "next/image";
import moment from "moment/moment";
import { X } from "lucide-react";
import { Checkbox } from "@components/checkbox";
import { CollapsibleContent, CollapsibleTrigger } from "@components/collapsible";
import { Collapsible } from "@components/collapsible";
import { Button } from "@components/button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export interface MessageEntryProps {
   message: Message & { recipient: User, sender: User };
   onMarkChange: (marked: boolean) => void;
}

const MessageEntry = ({ message, onMarkChange }: MessageEntryProps) => {
   const [open, setOpen] = useState(false);

   return (
      <Collapsible onOpenChange={setOpen} open={open} className={`border-b-[1px] border-neutral-300`}>
         <CollapsibleTrigger className={`w-full`}>
            <div className={`w-full flex items-center gap-4 p-3`}>
               <Checkbox onCheckedChange={onMarkChange} />
               <Link href={`/users/${message.recipient.id}`}>
                  <Image
                     title={message.recipient.name}
                     className={`rounded-md shadow-md hover:opacity-80 transition-opacity duration-200`} height={50}
                     width={50} src={message.recipient.image}
                     alt={message.recipient.name} />
               </Link>
               <div className={`flex flex-col items-start justify-between gap-0 !h-full`}>
                  <Link href={`/users/${message.recipient.id}`}>
                     <span
                        title={message.recipient.name}
                        className={`text-base`}>
                        {message.recipient.name}
                     </span>
                  </Link>
                  <span className={`text-sm cursor-pointer font-semibold text-blue-500`}>{message.subject}</span>
               </div>
               <div className={`justify-self-end flex ml-auto items-center gap-2`}>
            <span className={`text-neutral-400 text-xs`}>
               {moment(message.createdAt).fromNow()}
            </span>
                  <span title={`Delete`} className={`text-neutral-400 text-xs cursor-pointer`}>
               <X size={16} />
            </span>
               </div>
            </div>
         </CollapsibleTrigger>
         <AnimatePresence mode={`sync`}>
            <CollapsibleContent className={` w-full`}>
               {open && (
                  <motion.div
                     key={`content`}
                     transition={{ duration: 0.2 }}
                     animate={{
                        height: `100%`, opacity: 100,
                     }}
                     initial={{
                        height: 0, opacity: 0,
                     }}
                     exit={{
                        height: 0, opacity: 0,
                     }}

                     className={`w-full`}>
                     <div className={`flex flex-col items-start gap-2 w-full`}>
                        <span className={`pl-28 text-sm text-neutral-500`}>
                           {message.text}
                        </span>
                        <div
                           className={`flex px-12 py-4 items-center gap-2 w-full`}>
                           <Button className={`rounded-full shadow-md`} variant={`default`}>Message</Button>
                           <Button variant={`link`} asChild>
                              <Link
                                 className={`hover:no-underline`}
                                 target={`_blank`}
                                 href={`https://translate.google.com/?sl=auto&tl=bg&text=${encodeURIComponent(message.text)}&op=translate`}>
                                 Translate
                              </Link>
                           </Button>
                        </div>
                     </div>
                  </motion.div>
               )}
            </CollapsibleContent>
         </AnimatePresence>
      </Collapsible>
   );
};

export default MessageEntry;
