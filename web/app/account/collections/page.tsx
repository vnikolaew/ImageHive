import React from "react";
import MediaSearchBar from "../media/_components/MediaSearchBar";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";
import CollectionTabs from "@/app/account/collections/_components/Tabs";
import { Image, ImageCollection, Prisma } from "@prisma/client";
import CollectionsGrid from "@/app/account/collections/_components/CollectionsGrid";
import { GenericSortDropdown } from "@/app/account/media/_components/MediaSortDropdown";
import UserDownloadsHistory from "@/app/account/collections/_components/UserDownloadsHistory";
import { getImageLikes } from "@/app/_components/HomeFeedSection";
import * as sea from "node:sea";

export interface PageProps {
   searchParams: { sort: string, tab?: string, qs?: string };
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

export const SortOptions = [
   `Last Modified`,
   `Name (A-Z)`,
] as const;

const Page = async ({ searchParams }: PageProps) => {
   const session = await auth();
   let orderBy: Prisma.ImageCollectionOrderByWithRelationAndSearchRelevanceInput | Prisma.ImageCollectionOrderByWithRelationAndSearchRelevanceInput[] | undefined;

   console.log({ searchParams });
   if (searchParams.sort === SortOptions[0]) {
      orderBy = { updatedAt: `desc` };
   } else if (searchParams.sort === SortOptions[1]) {
      orderBy = { title: `desc` };
   }


   let titleFilter: string | Prisma.StringFilter<"ImageCollection"> | undefined;
   if (searchParams.qs?.length) {
      titleFilter = {
         contains: searchParams.qs,
         mode: `insensitive`,
      };
   }
   const userCollections = await xprisma
      .imageCollection
      .findMany({
         where: {
            userId: session?.user?.id as string,
            ...(titleFilter ? { title: titleFilter } : {}),
         },
         ...(orderBy ? { orderBy } : {}),
         include: {
            images: {
               take: 3,
               orderBy: { createdAt: `desc` },
               include: {
                  image: true,
               },
            },
         },
      });

   const downloads = await xprisma.imageDownload.findMany({
      where: {
         userId: session?.user?.id as string,
      },
      orderBy: {
         createdAt: "desc",
      },
      include: {
         image: {
            include: { owner: true },
         },
      },
   });
   downloads.forEach(d => {
      const { verifyPassword, updatePassword, ...rest } = d.image.owner;
      //@ts-ignore
      d.image.owner = rest;
   });

   const likedImages = await getImageLikes();

   return (
      <div className={`my-12 min-h-[70vh]`}>
         <div className={`flex items-center justify-between`}>
            <CollectionTabs collectionsLength={userCollections.length} />
            <div className={`flex items-center gap-4 w-2/5`}>
               <MediaSearchBar placeholder={`Search collections`} qs={``} />
               <GenericSortDropdown options={SortOptions} />
            </div>
         </div>
         <Separator className={`w-full my-4 h-[1px]`} />
         <CollectionsGrid qs={searchParams.qs} userCollections={userCollections} />
         <UserDownloadsHistory
            likedImages={new Set(...likedImages.map(i => i.imageId))} downloads={downloads} />
      </div>
   );
};

export default Page;