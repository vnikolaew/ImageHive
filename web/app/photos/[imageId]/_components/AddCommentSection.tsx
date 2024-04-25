"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import DefaultAvatar from "@/public/default-avatar.png";
import { cn, getSessionImageSrc } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { handleCommentOnImage } from "@/app/photos/[imageId]/actions";
import { usePromise } from "@/hooks/usePromise";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import { useOnClickOutside } from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";

export interface AddCommentSectionProps {
   imageId: string;
}

export function AddCommentSection({ imageId }: AddCommentSectionProps) {
   const { data: session } = useSession();
   const commentInputRef = useRef<HTMLTextAreaElement>(null!);

   useOnClickOutside(commentInputRef.current, e => {
      if (e.target!.id !== `submit`) {
         setExpandComment(false);
      }
   });

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

   async function handleSubmitComment(e) {
      e.preventDefault();
      await handleComment(comment);
   }

   return (
      <div className={`w-full h-fit mt-4 flex items-start justify-between gap-4`}>
         <Image height={36} width={36}
                className={`rounded-full p-0 border-white bg-white border-[1px] cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                src={getSessionImageSrc(session!.user?.image!) ?? DefaultAvatar}
                alt={session!.user?.name! ?? ``} />
         <div className={`flex flex-1 flex-col gap-2 items-start`}>
            <Textarea
               id={`comment-area`}
               ref={commentInputRef}
               value={comment}
               onChange={e => setComment(e.target.value)}
               onFocus={_ => setExpandComment(true)}
               placeholder={`Add your comment`}
               className={cn(`rounded-2xl resize-none !pl-6 !py-3 border-none bg-neutral-100 text-black flex-1 focus-visible:outline-none focus-visible:border-none focus-visible:ring-0 placeholder:text-neutral-400 transition-all duration-200`,
                  expandComment && `!h-[200px]`)} />
            {expandComment && (
               <Button
                  id={`submit`}
                  onClick={handleSubmitComment} disabled={comment.length === 0 || loading}
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