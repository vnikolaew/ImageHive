"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import DefaultAvatar from "@/public/default-avatar.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { handleCommentOnImage } from "@/app/photos/[imageId]/actions";
import { usePromise } from "@/hooks/usePromise";
import { LoadingSpinner } from "@/components/modals/SocialLogins";

export interface AddCommentSectionProps {
   imageId: string;
}

export function AddCommentSection({ imageId }: AddCommentSectionProps) {
   const { data: session } = useSession();
   const [expandComment, setExpandComment] = useState(false);
   const [comment, setComment] = useState(``);
   const { action: handleComment, loading } = usePromise((comment: string) => {
      return handleCommentOnImage(imageId, comment)
         .then(res => {
            if (res.success) {
               setComment(``);
               setExpandComment(false);
            }
         }).catch(console.error);

   });

   if (!session) return null;

   async function handleSubmitComment() {
      await handleComment(comment);
   }

   return (
      <div className={`w-full h-fit mt-4 flex items-start justify-between gap-4`}>
         <Image height={36} width={36}
                className={`rounded-full p-1 border-white bg-white border-[1px] cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                src={session!.user?.image! ?? DefaultAvatar}
                alt={session!.user?.name! ?? ``} />
         <div className={`flex h-auto flex-1 flex-col gap-2 items-start`}>
            <Textarea
               value={comment}
               onChange={e => setComment(e.target.value)}
               onBlur={_ => setExpandComment(false)} onFocus={_ => setExpandComment(true)} rows={1}
               placeholder={`Add your comment`}
               className={cn(`rounded-2xl resize-none !min-h-[10px] !pl-6 !py-3 border-none bg-neutral-100 text-black flex-1 focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 placeholder:text-neutral-400 transition-all duration-200`,
                  expandComment && `!h-[70px]`)} />
            {expandComment && (
               <Button onClick={handleSubmitComment} disabled={comment.length === 0 || loading}
                       className={`px-12 rounded-xl mt-2`}
                       variant={`secondary`}>
                  {loading ? (
                     <LoadingSpinner text={`Sending ...`} />
                  ) : (
                     `Submit`
                  )}
               </Button>
            )}
         </div>
      </div>
   );
}