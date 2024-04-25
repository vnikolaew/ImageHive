import React from "react";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MediaSearchBar from "@/app/account/media/_components/MediaSearchBar";
import MediaSortDropdown from "@/app/account/media/_components/MediaSortDropdown";
import { getImageLikes } from "@/app/_components/HomeFeedSection";
import { Image as IImage } from "prisma/prisma-client";
import { CollectionGridColumn } from "./_components/CollectionGridColumn";

export interface PageProps {
   params: { collectionId: string },
   searchParams: {}
}

const Page = async (props: PageProps) => {
   const session = await auth();
   const collection = await xprisma.imageCollection.findFirst({
      where: {
         userId: session!.user?.id as string,
         id: props.params.collectionId,
      },
      include: {
         images: {
            include: {
               image: {
                  include: { owner: true },
               },
            },
         },
      },
   });

   if (!collection) return notFound();

   const likedImages = await getImageLikes();
   const likedImageIds = new Set<string>(likedImages.map(i => i.imageId));

   const images = collection.images.map(_ => _.image);

   const firstColumn = images.filter((_, index) => index % 4 === 0);
   const secondColumn = images.filter((_, index) => index % 4 === 1);
   const thirdColumn = images.filter((_, index) => index % 4 === 2);
   const fourthColumn = images.filter((_, index) => index % 4 === 3);

   return (
      <div>
         <div className={`w-full flex items-center justify-between mt-4`}>
            <div className={`flex items-center gap-4`}>
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <Button variant={`ghost`} className={`rounded-full p-3 !w-10 !h-10`}><ArrowLeft
                           size={16} /></Button>
                     </TooltipTrigger>
                     <TooltipContent side={`bottom`}
                                     className={`!px-3 py-[1px] !text-[.7rem] rounded-xl bg-black text-white`}>
                        Collections
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
               <div className={`flex flex-col gap-1`}>
                  <span>{collection.title}</span>
                  <div className={`text-md text-neutral-500 flex items-center gap-2`}> {collection.public ?
                     <Eye size={16} /> : <EyeOff size={16} />}
                     <span className={`text-sm`}>
            {collection.images.length} {collection.images.length === 1 ? `item` : `items`}
            </span>
                  </div>
               </div>
            </div>
            <div className={`flex items-center gap-2`}>
               <MediaSearchBar placeholder={`Search`} qs={``} />
               <MediaSortDropdown />
            </div>
         </div>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-0`}>
            <CollectionGridColumn
               collectionId={collection.id} likedImageIds={likedImageIds} key={1}
               images={firstColumn} />
            <CollectionGridColumn
               collectionId={collection.id} likedImageIds={likedImageIds} key={2}
               images={secondColumn} />
            <CollectionGridColumn
               collectionId={collection.id} likedImageIds={likedImageIds} key={3}
               images={thirdColumn} />
            <CollectionGridColumn
               collectionId={collection.id} likedImageIds={likedImageIds} key={4}
               images={fourthColumn} />
         </div>
      </div>
   );
};

export interface CollectionGridColumnProps {
   images: (IImage & { dimensions: number[][] })[];
   likedImageIds: Set<string>;
}

export default Page;
