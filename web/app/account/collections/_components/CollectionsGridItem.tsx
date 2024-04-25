"use client";
import React from "react";
import { ImageCollectionItem } from "@/app/account/collections/page";
import Image from "next/image";
import { getFileName } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export interface CollectionsGridItemProps {
   userCollection: ImageCollectionItem;
}

const CollectionsGridItem = ({ userCollection }: CollectionsGridItemProps) => {
   return (
      <Link href={`/account/collections/${userCollection.id}`}>
         <div className={`flex flex-col group items-start gap-1 !w-fit cursor-pointer`}>
            <div>
               <Image
                  className={`rounded-lg shadow-sm group-hover:brightness-75 transition-all duration-200 overflow-hidden`}
                  height={400}
                  width={400}
                  src={`/uploads/${getFileName(userCollection.images[0].image.absolute_url)}`}
                  alt={``} />
            </div>
            <h2 className={`mt-2 text-xl`}>{userCollection.title}</h2>
            <div className={`text-md text-neutral-500 flex items-center gap-2`}> {userCollection.public ? <Eye size={20} /> : <EyeOff size={20} />}
               <span>
            {userCollection.images.length} items
            </span>
            </div>

         </div>

      </Link>
   );
};

export default CollectionsGridItem;