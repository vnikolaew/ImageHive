import React from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MediaSearchBar from "@/app/account/media/_components/MediaSearchBar";
import { Image as IImage } from "prisma/prisma-client";
import { CollectionGridColumn } from "./_components/CollectionGridColumn";
import { GenericSortDropdown } from "@/app/account/media/_components/GenericSortDropdown";
import EditCollectionButton from "@/app/account/collections/[collectionId]/_components/EditCollectionButton";
import Link from "next/link";
import { getImageCollectionById } from "@/app/account/collections/[collectionId]/_queries";
import { getLikedImageIds } from "@/app/_queries";

export interface PageProps {
   params: { collectionId: string },
   searchParams: {}
}

const Page = async (props: PageProps) => {
   const collection = await getImageCollectionById(props.params.collectionId);
   if (!collection) return notFound();

   console.log(collection.images);

   const likedImageIds = await getLikedImageIds();
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
                        <Button asChild variant={`ghost`} className={`rounded-full p-3 !w-10 !h-10`}>
                           <Link href={`/account/collections?tab=collections`}>
                              <ArrowLeft
                                 size={16}
                              />
                           </Link>
                        </Button>
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
               <GenericSortDropdown options={[]} />
               <EditCollectionButton collectionId={collection.id} />
            </div>
         </div>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-0`}>
            <CollectionGridColumn
               collectionId={collection.id}
               likedImageIds={likedImageIds} key={1}
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
