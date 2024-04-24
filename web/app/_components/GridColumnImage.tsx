"use client";
import React from "react";
import { Image } from "@prisma/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart } from "lucide-react";
import { handleLikeImage, handleUnlikeImage } from "@/app/actions";
import { cn } from "@/lib/utils";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { useQsImageId } from "@/hooks/useQsImageId";
import Link from "next/link";

export interface GridColumnImageProps {
   image: Image;
   imageUrl: string;
   likedByMe: boolean;
   imageKey: string;
}

const GridColumnImage = ({
                            imageUrl,
                            likedByMe,
                            image: { tags, id, absolute_url, dimensions_set },
                         }: GridColumnImageProps) => {
   const IMAGE_WIDTH = 340;
   const { openModal } = useModals();
   const [, setImageId] = useQsImageId();

   const [x, y] = dimensions_set[0].split(`,`).map(x => Number(x));

   async function handleAddToCollection() {
      setImageId(id).then(_ => {
         setTimeout(_ => openModal(ModalType.ADD_IMAGE_TO_COLLECTION), 100);
      });
   }

   async function handleLikeImageClient(id: string) {
      if (likedByMe) handleUnlikeImage(id).then(console.log).catch(console.error);
      else handleLikeImage(id).then(console.log).catch(console.error);
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
            <div className={`absolute flex gap-2 items-center justify-start w-5/6 top-3 left-3`}>
               <ActionButton text={`Add to collection`} icon={<Bookmark className={`text-white`} size={18} />} action={handleAddToCollection} />
               <ActionButton
                  active={likedByMe}
                  text={likedByMe ? `Unlike` : `Like`} icon={<Heart className={`text-white`} size={18} />}
                  action={() => handleLikeImageClient(id)} />
            </div>
            <div
               className={`absolute items-center gap-2 hidden group-hover:flex text-sm lg:text-md bottom-2 left-4 `}>
               {tags.sort().slice(0, 4).map((tag, i) => (
                  <span className={`text-sm lg:text-md text-neutral-100`} key={i}>{tag}</span>
               ))}
            </div>
         </div>
      </Link>
   );
};

interface ActionButtonProps {
   text: string;
   icon: React.ReactNode;
   action?: () => void | Promise<void>;
   active?: boolean;
}

const ActionButton = ({ action, active, icon, text }: ActionButtonProps) => {
   return (
      <TooltipProvider delayDuration={100}>
         <Tooltip>
            <TooltipTrigger className={`cursor-auto`}>
               <Button onClick={e => {
                  e.preventDefault()
                  action?.()
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
};

export default GridColumnImage;