"use client";
import React from "react";
import { Bookmark, CircleCheck, Download, Heart, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageAction } from "@/app/photos/[imageId]/_components/ImageAction";
import { ImageSummary as IImageSummary } from "@/app/photos/[imageId]/page";
import ImageStatistics from "@/app/photos/[imageId]/_components/ImageStatistics";
import ImageOwnerSection from "@/app/photos/[imageId]/_components/ImageOwnerSection";
import { cn, downloadImage } from "@/lib/utils";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { usePromise } from "@/hooks/usePromise";
import { handleLikeImage, handleUnlikeImage } from "@/app/actions";

export interface ImageSummaryProps {
   image: IImageSummary;
   haveILiked: boolean;
}

const ImageSummary = ({ image, haveILiked }: ImageSummaryProps) => {
   const { openModal } = useModals();
   const { loading, action: handleLike } = usePromise(() => {
      if (haveILiked) {
         return handleUnlikeImage(image.id).then(console.log).catch(console.error);
      } else {
         return handleLikeImage(image.id).then(console.log).catch(console.error);
      }
   });

   async function handleDownloadImage() {
      const imgElement = document.getElementById(`image-${image.id}`);
      if (imgElement) downloadImage(imgElement as HTMLImageElement, image.original_file_name);
   }

   return (
      <div
         className="w-full h-fit sticky top-12 rounded-lg dark:bg-border flex flex-col items-start gap-4 shadow-lg p-6">
         <div className={`w-full flex items-center gap-2`}>
            <CircleCheck className={`dark:text-neutral-200`} size={16} />
            <span className={`dark:text-neutral-300 text-sm`}>  Free for use under the ImageHive <Link
               className={`hover:underline font-semibold`} href={`/`}>
               Content License
            </Link> </span>
         </div>
         <div className={`w-full mt-4 flex items-center justify-center gap-2`}>
            <Button onClick={handleDownloadImage} variant={`default`} className={`px-16 gap-2 rounded-full shadow-md`}>
               <Download size={16} />
               Download
            </Button>
         </div>
         <Separator className={`w-full mt-6 dark:bg-neutral-500`} />
         <div className={`w-full flex items-center justify-center gap-2 mt-2`}>
            <ImageAction
               action={handleLike}
               icon={<Heart className={cn(haveILiked && `text-primary`)} size={20} />}
               text={
                  <span className={cn(haveILiked && `text-primary`)}>{image._count.likes}</span>
               }
               className={haveILiked && `!border-primary`}
               tooltipText={`Like`} />
            <ImageAction icon={<Bookmark size={20} />} text={`Saved`} tooltipText={`Add to collection`} />
            <ImageAction icon={<MessageSquare size={18} />} text={``} tooltipText={`Comment`} />
            <ImageAction action={() => openModal(ModalType.SHARE_PROFILE)} icon={<Share2 size={20} />} text={``}
                         tooltipText={`Share`} />
         </div>
         <div className={`w-full`}>
            <ImageStatistics image={image} />
         </div>
         <Separator className={`w-full mt-6 dark:bg-neutral-500`} />
         <ImageOwnerSection owner={image.owner} />
      </div>
   );
};


export default ImageSummary;
