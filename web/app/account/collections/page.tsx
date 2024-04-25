import React from "react";
import MediaSearchBar from "../media/_components/MediaSearchBar";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import CollectionTabs from "@/app/account/collections/_components/Tabs";
import { Image, ImageCollection, Prisma } from "@prisma/client";
import CollectionsGrid from "@/app/account/collections/_components/CollectionsGrid";

export interface PageProps {
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
      image: Image
   }[],
});

const Page = async ({}: PageProps) => {
   const session = await auth();
   const userCollections = await xprisma
      .imageCollection
      .findMany({
         where: {
            userId: session?.user?.id as string,
         },
         include: {
            images: {
               take: 3,
               orderBy: { createdAt: `desc` },
               include: {
                  image: true
               }
            },
         },
      });

   return (
      <div className={`my-12 min-h-[70vh]`}>
         <div className={`flex items-center justify-between`}>
            <CollectionTabs collectionsLength={userCollections.length} />
            <div className={`flex items-center gap-4 w-2/5`}>
               <MediaSearchBar qs={``} />
            </div>
         </div>
         <Separator className={`w-full my-4 h-[2px]`} />
         <CollectionsGrid userCollections={userCollections} />
      </div>
   );
};

export default Page;