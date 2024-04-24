"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface AddCommentSectionProps {
   imageId: string;
}

export function AddCommentSection({ imageId }: AddCommentSectionProps) {
   const { data: session } = useSession();
   const [expandComment, setExpandComment] = useState(false);
   if (!session) return null;

   return (
      <div className={`w-full mt-4 flex items-center justify-between gap-4`}>
         <Image height={36} width={36}
                className={`rounded-full cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                src={session!.user?.image!} alt={session!.user?.name! ?? ``} />
         <Textarea
            onBlur={_ => setExpandComment(false)} onFocus={_ => setExpandComment(true)} rows={1}
            placeholder={`Add your comment`}
            className={cn(`rounded-2xl resize-none !min-h-[10px] !pl-6 !py-3 border-none bg-neutral-100 text-black flex-1 focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 placeholder:text-neutral-400 transition-all duration-200`,
               expandComment && `!h-[70px]`)} />
      </div>
   );
}