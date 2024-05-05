"use client";
import React from "react";
import Image from "next/image";
import { Bookmark, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { getFileName, isAbsoluteUrl } from "@utils";
import { Button } from "@components/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";
import { ImageCollection, Prisma, Image as IImage } from "@prisma/client";

export interface CollectionsGridItemProps {
   userCollection: ImageCollectionItem;
}

export type ImageCollectionItem
  = (ImageCollection & {
  images: {
    metadata: Prisma.JsonValue
    createdAt: Date
    updatedAt: Date
    id: string
    is_deleted: boolean
    collectionId: string
    imageId: string,
    image: IImage
  }[],
});

const CollectionsGridItem = ({ userCollection }: CollectionsGridItemProps) => {
   const hasItems = !!userCollection?.images?.length;
   const imageUrl = isAbsoluteUrl(userCollection?.images?.[0]?.image?.absolute_url)
      ? userCollection?.images?.[0]?.image?.absolute_url :
      `/uploads/${getFileName(userCollection?.images?.[0]?.image?.absolute_url)}`;

   return (
      <Link className={`w-fit`} href={`/account/collections/${userCollection.id}`}>
         <div className={`flex flex-col group items-start gap-1 !w-fit cursor-pointer`}>
            <div>
               {hasItems ? (
                  <Image
                     className={`rounded-lg shadow-sm group-hover:brightness-75 transition-all duration-200 overflow-hidden`}
                     height={400}
                     width={400}
                     src={imageUrl}
                     alt={``} />
               ) : (
                  <div style={{ width: `400px`, height: `400px` }}
                       className={`flex items-center justify-center flex-col gap-4 bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors duration-200`}>
                     <Button variant={`secondary`}
                             className={`rounded-full !p-3 !h-fit !w-fit bg-neutral-500 hover:!bg-neutral-500`}>
                        <Bookmark className={`fill-neutral-700`} size={16} />
                     </Button>
                     <span className={`text-base text-neutral-500`}>No elements</span>
                  </div>
               )}
            </div>
            <h2 className={`mt-2 !text-lg 2xl:text-xl`}>{userCollection.title}</h2>
            <div className={`!text-sm 2xl:text-base text-neutral-500 flex items-center gap-2`}>
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger className={`cursor-auto`}>
                        {userCollection.public ? <Eye size={20} /> : <EyeOff size={20} />}
                     </TooltipTrigger>
                     <TooltipContent side={`bottom`}
                                     className={`!text-xs rounded-lg bg-black text-white dark:bg-white dark:text-black`}>
                        {userCollection.public ? `Public` : `Private`}
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
               <span>
            {userCollection.images.length} items
            </span>
            </div>
         </div>
      </Link>
   );
};

export default CollectionsGridItem;
