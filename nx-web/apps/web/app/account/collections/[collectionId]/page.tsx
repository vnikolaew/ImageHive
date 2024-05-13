import { notFound } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Upload } from "lucide-react";
import { CollectionGridColumn } from "./_components/CollectionGridColumn";
import Link from "next/link";
import { getImageCollectionById } from "@web/app/account/collections/[collectionId]/_queries";
import { getLikedImageIds } from "@web/app/_queries";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";
import { Button } from "@components/button";
import MediaSearchBar from "@web/app/account/media/_components/MediaSearchBar";
import { GenericSortDropdown } from "@web/app/_components/GenericSortDropdown";
import EditCollectionButton from "@web/app/account/collections/[collectionId]/_components/EditCollectionButton";
import React, { Fragment } from "react";

export interface PageProps {
   params: { collectionId: string },
   searchParams: Record<string, string>
}

const Page = async (props: PageProps) => {
   const collection = await getImageCollectionById(props.params.collectionId);
   if (!collection) return notFound();

   const likedImageIds = await getLikedImageIds();
   const images = collection.images.map(_ => _.image);

   const columns = Array
      .from({ length: 4 })
      .map((_, i) =>
         images.filter((_, index) => index % 4 === i));

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
            {!!images?.length ? (
               <Fragment>
                  {
                     columns.map((c, index) => (
                        <CollectionGridColumn
                           collectionId={collection.id}
                           likedImageIds={likedImageIds}
                           key={index}
                           images={c} />
                     ))
                  }
               </Fragment>
            ) : (
               <div className={`text-neutral-500 !w-full col-span-4 flex items-center justify-center mt-8 flex-col gap-2`}>
                  <span className={`text-neutral-500`}>
                     You have no images in this collection.
                  </span>
                  <Button className={`flex gap-2 items-center !px-8 shadow-md`} size={`default`} variant={`outline`}>
                     <Upload size={18} /> Upload now
                  </Button>
               </div>
            )}
         </div>
      </div>
   );
};


export default Page;
