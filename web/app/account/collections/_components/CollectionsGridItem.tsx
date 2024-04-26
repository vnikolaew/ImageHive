"use client";
import React from "react";
import { ImageCollectionItem } from "@/app/account/collections/page";
import Image from "next/image";
import { getFileName } from "@/lib/utils";
import { Bookmark, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface CollectionsGridItemProps {
   userCollection: ImageCollectionItem;
}

const CollectionsGridItem = ({ userCollection }: CollectionsGridItemProps) => {
   const hasItems = !!userCollection?.images?.length

   return (
      <Link className={`w-fit`} href={`/account/collections/${userCollection.id}`}>
         <div className={`flex flex-col group items-start gap-1 !w-fit cursor-pointer`}>
            <div>
               {hasItems ? (
                  <Image
                     className={`rounded-lg shadow-sm group-hover:brightness-75 transition-all duration-200 overflow-hidden`}
                     height={400}
                     width={400}
                     src={`/uploads/${getFileName(userCollection?.images?.[0]?.image?.absolute_url)}`}
                     alt={``} />
               ) : (
                  <div style={{ width: `400px`, height: `400px`}} className={`flex items-center justify-center flex-col gap-4 bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors duration-200`}>
                     <Button variant={`secondary`} className={`rounded-full !p-3 !h-fit !w-fit bg-neutral-500 hover:!bg-neutral-500`}>
                        <Bookmark className={`fill-neutral-700`} size={16} />
                     </Button>
                     <span className={`text-base text-neutral-500`}>No elements</span>
                  </div>
               )}
            </div>
            <h2 className={`mt-2 !text-lg 2xl:text-xl`}>{userCollection.title}</h2>
            <div className={`!text-sm 2xl:text-base text-neutral-500 flex items-center gap-2`}>
               {userCollection.public ? <Eye size={20} /> : <EyeOff size={20} />}
               <span>
            {userCollection.images.length} items
            </span>
            </div>
         </div>
      </Link>
   );
};

export default CollectionsGridItem;