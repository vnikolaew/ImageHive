"use client";
import React from "react";
import { Bookmark, CircleCheck, Download, Heart, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ImageAction } from "@/app/photos/[imageId]/_components/ImageAction";
import ImageStatistics from "@/app/photos/[imageId]/_components/ImageStatistics";
import ImageOwnerSection from "@/app/photos/[imageId]/_components/ImageOwnerSection";
import { cn, downloadImage } from "@/lib/utils";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { usePromise } from "@/hooks/usePromise";
import { handleLikeImage, handleUnlikeImage } from "@/app/actions";
import { handleDownloadImage } from "@/app/photos/[imageId]/actions";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import { useQueryString } from "@/hooks/useQueryString";
import posthog from "posthog-js";
import { useSession } from "next-auth/react";
import { ImageSummary as IImageSummary  } from "@/app/photos/[imageId]/_queries";

export interface ImageSummaryProps {
   image: IImageSummary,
   haveILiked: boolean,
   haveIDownloaded: boolean,
   haveISaved: boolean,
   haveIFollowed: boolean
}

const ImageSummary = ({ image, haveILiked, haveIDownloaded, haveISaved, haveIFollowed }: ImageSummaryProps) => {
   const { openModal } = useModals();
   const [, setImageId] = useQueryString();
   const session = useSession();
   const { loading, action: handleLike } = usePromise(async () => {
      if(!session.data)  {
         openModal(ModalType.SIGN_IN)
         return
      }
      if (haveILiked) {
         return handleUnlikeImage(image.id).then(console.log).catch(console.error);
      } else {
         return handleLikeImage(image.id).then(console.log).catch(console.error);
      }
   });
   const { loading: downloadLoading, action: handleDownload } = usePromise(async () => {
      return await handleDownloadImage(image.id)
         .then(res => {
            console.log({ res });
            if (res.success) {

               const result = posthog.capture(`image_download`, {
                  $event_type: `image_download`,
                  imageId: image.id,
                  userId: session.data?.user?.id,
                  timestamp: Date.now(),
               });
               console.log({ result });
            }
         }).catch(console.error);
   });


   async function handleDownloadImageClient() {
      const imgElement = document.getElementById(`image-${image.id}`);
      if (imgElement) downloadImage(imgElement as HTMLImageElement, image.original_file_name);

      // if (!haveIDownloaded) {
      await handleDownload();
      // }
   }

   async function handleAddToCollection() {
      if(!session.data) {
         openModal(ModalType.SIGN_IN)
         return;
      }

      setImageId(image.id).then(_ => {
         setTimeout(_ => openModal(ModalType.ADD_IMAGE_TO_COLLECTION), 100);
      });
   }

   return (
      <div
         className="w-full h-fit border-[1px] border-neutral-100 sticky top-12 rounded-lg dark:bg-border flex flex-col items-start gap-4 shadow-lg p-6">
         <div className={`w-full flex items-center gap-2 justify-center`}>
            <CircleCheck className={`dark:text-neutral-200`} size={16} />
            <span className={`dark:text-neutral-300 text-sm`}>  Free for use under the ImageHive <Link
               className={`hover:underline font-semibold`} href={`/`}>
               Content License
            </Link> </span>
         </div>
         <div className={`w-full mt-4 flex items-center justify-center gap-2`}>
            <Button
               disabled={downloadLoading} onClick={handleDownloadImageClient} variant={`default`}
               className={`px-16 gap-2 rounded-full shadow-md`}>
               {downloadLoading ? (
                  <LoadingSpinner text="Downloading..." />
               ) : <>
                  <Download size={16} />
                  Download
               </>
               }
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
               className={cn(haveILiked && `!border-primary !border-[2px]`)}
               tooltipText={`Like`} />
            <ImageAction
               action={handleAddToCollection}
               className={cn(haveISaved && `!border-primary !border-[2px]`)}
               icon={<Bookmark className={cn(haveISaved && `text-primary`)}
                               size={20} />}
               text={
                  <span className={cn(haveISaved && `text-primary`)}>Save{haveISaved ? `d` : ``}</span>
               }
               tooltipText={`Add to collection`} />
            <ImageAction action={() => {
               const element = document.getElementById(`comment-area`) as HTMLTextAreaElement;

               element?.scrollIntoView({ behavior: `smooth`,});
               setTimeout(() => {
                  element?.focus({ preventScroll: false });
               }, 200);
            }} icon={<MessageSquare size={18} />} text={``} tooltipText={`Comment`} />
            <ImageAction
               action={() => openModal(ModalType.SHARE_PROFILE)} icon={<Share2 size={20} />} text={``}
               tooltipText={`Share`} />
         </div>
         <div className={`w-full`}>
            <ImageStatistics image={image} />
         </div>
         <Separator className={`w-full mt-6 dark:bg-neutral-500`} />
         <ImageOwnerSection haveIFollowed={haveIFollowed} owner={image.owner} />
      </div>
   );
};


export default ImageSummary;
