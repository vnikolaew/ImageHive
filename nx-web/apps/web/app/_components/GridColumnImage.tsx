"use client";
import React from "react";
import { Image } from "@prisma/client";
import { Bookmark, Bot, Heart } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import { useQueryString } from "@web/hooks/useQueryString";
import { handleLikeImage, handleUnlikeImage } from "@web/app/actions";
import { cn } from "@nx-web/shared";
import { Button } from "@components/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TooltipTriggerProps } from "@components/tooltip";
import { useAction } from "next-safe-action/hooks";

export interface GridColumnImageProps {
   image: Image;
   imageUrl: string;
   likedByMe: boolean;
   savedByMe?: boolean;
   imageKey: string;
   topContent?: React.ReactNode;
   bottomContent?: React.ReactNode;
}

const GridColumnImage = ({
                            imageUrl,
                            likedByMe,
                            savedByMe,
                            topContent,
                            bottomContent,
                            image: { tags, id, dimensions_set, metadata },
                         }: GridColumnImageProps) => {
   const IMAGE_WIDTH = 340;
   const { openModal } = useModals();
   const session = useSession();
   const [, setImageId] = useQueryString();

   const [x, y] = dimensions_set[0].split(`,`).map(x => Number(x));

   async function handleAddToCollection() {
      if (!session.data) {
         openModal(ModalType.SIGN_IN);
         return;
      }
      setImageId(id).then(_ => {
         setTimeout(_ => openModal(ModalType.ADD_IMAGE_TO_COLLECTION), 100);
      });
   }

   const { execute: likeImage, status } = useAction(handleLikeImage, {
      onSuccess: res => {
         if (res.success) console.log(res);
      },
      onError: console.error,
   });

   const { execute: unlikeImage, status: unlikeStatus } = useAction(handleUnlikeImage, {
      onSuccess: res => {
         if (res.success) console.log(res);
      },
      onError: console.error,
   });

   async function handleLikeImageClient(id: string) {
      if (!session.data) {
         openModal(ModalType.SIGN_IN);
         return;
      }

      if (likedByMe) unlikeImage(id);
      else likeImage(id);
   }

   return (
      <Link href={`/photos/${id}`}>
         <div
            style={{
               backgroundImage: `url(${imageUrl})`,
               backgroundPosition: `center center`,
               backgroundSize: "cover",
               position: "relative",
               width: `100%`,
               height: `${Math.round((IMAGE_WIDTH / x) * y)}px`,
            }}
            className={`cursor-pointer group rounded-lg hover:opacity-80 transition-opacity duration-200 overflow-hidden`}
         >
            <div className={`absolute hidden group-hover:flex gap-2 items-center w-full top-3 left-3`}>
               {topContent !== undefined ? topContent : (
                  <div className={`flex items-center gap-2 w-11/12`}>
                     <ActionButton
                        text={`Add to collection`}
                        active={savedByMe}
                        icon={<Bookmark className={`text-white`} size={18} />}
                        action={handleAddToCollection} />
                     <ActionButton
                        active={likedByMe}
                        text={likedByMe ? `Unlike` : `Like`} icon={<Heart className={`text-white`} size={18} />}
                        action={() => handleLikeImageClient(id)} />
                     {(metadata as any)?.aiGenerated && (
                        <div className={`justify-self-end flex justify-end flex-1`}>
                           <TooltipProvider>
                              <Tooltip>
                                 <TooltipTrigger>
                                    <Button variant={`ghost`} className={`bg-transparent hover:bg-transparent`}>
                                       <Bot className={`text-white`} size={18} />
                                    </Button>
                                 </TooltipTrigger>
                                 <TooltipContent side={`bottom`} className={`!text-xs rounded-lg bg-black text-white`}>
                                    This media was generated by AI.
                                 </TooltipContent>
                              </Tooltip>
                           </TooltipProvider>
                        </div>
                     )}
                  </div>
               )}
            </div>
            <div
               className={`absolute items-center gap-2 hidden group-hover:flex text-sm lg:text-md bottom-4 left-4 `}>
               {bottomContent !== undefined ? bottomContent : (
                  tags.slice(0, 4).map((tag, i) => (
                     <span className={`text-sm lg:text-md text-neutral-100`} key={i}>{tag}</span>
                  ))
               )}
            </div>
         </div>
      </Link>
   )
      ;
};

interface ActionButtonProps extends TooltipTriggerProps {
   text: string;
   icon: React.ReactNode;
   action?: () => void | Promise<void>;
   active?: boolean;
}

export const ActionButton =
   ({
       action, active, icon, text, className, ...rest
    }:
       ActionButtonProps,
   ) => {
      return (
         <TooltipProvider delayDuration={100}>
            <Tooltip>
               <TooltipTrigger className={cn(`cursor-auto`, className)} {...rest}>
                  <Button onClick={e => {
                     e.preventDefault();
                     action?.();
                  }}
                          className={cn(`bg-transparent border-neutral-500 hover:border-neutral-300 hover:bg-transparent`,
                             active && `bg-green-500 hover:bg-green-600`)}
                          size={`icon`} variant={`outline`}>
                     {icon}
                  </Button>
               </TooltipTrigger>
               <TooltipContent side={`bottom`} className={`!text-xs rounded-lg bg-black text-white`}>
                  {text}
               </TooltipContent>
            </Tooltip>
         </TooltipProvider>
      );
   }
;

export default GridColumnImage;
