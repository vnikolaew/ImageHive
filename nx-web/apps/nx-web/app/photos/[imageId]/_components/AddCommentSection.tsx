"use client";
import React, { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import DefaultAvatar from "@/public/default-avatar.png";
import { useOnClickOutside } from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { usePromise } from "../../../../hooks/usePromise";
import { handleCommentOnImage } from "../actions";
import { Button, getSessionImageSrc } from "@nx-web/shared";
import { LoadingSpinner } from "../../../../components/modals/SocialLogins";

export interface AddCommentSectionProps {
   imageId: string;
}

export function AddCommentSection({ imageId }: AddCommentSectionProps) {
   const { data: session } = useSession();
   const commentInputRef = useRef<HTMLTextAreaElement>(null!);

   useOnClickOutside(commentInputRef.current, e => {
      if (e.target!.id !== `submit`) {
         setBig(false);
      }
   });

   const [comment, setComment] = useState(``);
   const showClearButton = useMemo(() => {
      return !!comment?.length;
   }, [comment?.length]);

   const { action: handleComment, loading } = usePromise((comment: string) => {
      return handleCommentOnImage(imageId, comment)
         .then(res => {
            if (res.success) {
               setComment(``);
               setBig(false);
            }
         }).catch(console.error);

   });

   const [big, setBig] = useState(false);
   if (!session) return null;

   async function handleSubmitComment(e) {
      e.preventDefault();
      await handleComment(comment);
   }

   return (
      <div className={`w-full h-fit mt-4 flex items-start justify-between gap-4`}>
         <Image height={36} width={36}
                className={`rounded-full p-0 border-white bg-white border-[1px] cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                src={session.user?.image ? getSessionImageSrc(session!.user?.image!) : DefaultAvatar}
                alt={session!.user?.name! ?? ``} />
         <div className={`flex flex-1 flex-col gap-2 items-start`}>
            <div className={`relative w-full`}>
               <motion.textarea
                  className={`resize-none relative !text-base placeholder:!text-neutral-400 placeholder:!text-sm p-2 rounded-xl w-full !pl-6 !py-4 border-none bg-neutral-100 text-black focus-visible:outline-none focus-visible:border-none focus-visible:ring-0  shadow-md !min-h-fit overflow-y-auto`}
                  style={{ scrollBehavior: `smooth` }}
                  placeholder={`Add your comment`}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  onFocus={_ => setBig(true)}
                  ref={commentInputRef}
                  id={`comment-area`}
                  transition={{ duration: 0.2 }}
                  initial={{ height: 60 }}
                  animate={{ height: big ? 80 : 60 }} />
               <AnimatePresence>
                  {showClearButton && (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: `auto` }}
                        transition={{ duration: 0.2, type: `spring` }}
                        exit={{ opacity: 0, height: 0 }}
                        onClick={_ => setComment(``)}
                        className={`absolute top-3 text-black right-4 cursor-pointer`}>
                        <X className={`text-red-500 !stroke-2`} size={16} />
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
            <AnimatePresence>
               {big && (
                  <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: `auto` }}
                     transition={{ duration: 0.2, type: `spring` }}
                     exit={{ opacity: 0, height: 0 }}
                  >
                     <Button
                        id={`submit`}
                        onClick={handleSubmitComment}
                        disabled={comment?.trim().length === 0 || loading}
                        className={`px-12 rounded-xl mt-2 shadow-sm`}
                        variant={`secondary`}>
                        {loading ? (
                           <LoadingSpinner text={`Sending ...`} />
                        ) : (
                           `Submit`
                        )}
                     </Button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
}
