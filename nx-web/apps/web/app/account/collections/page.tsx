import React from "react";
import MediaSearchBar from "../media/_components/MediaSearchBar";
import { Image, ImageCollection, Prisma } from "@prisma/client";
import { getUserImageCollections, getUserImageDownloads } from "@web/app/account/collections/_queries";
import { getImageLikes } from "@web/app/_queries";
import CollectionTabs from "@web/app/account/collections/_components/Tabs";
import { GenericSortDropdown } from "@web/app/_components/GenericSortDropdown";
import { Separator } from "@components/separator";
import CollectionsGrid from "@web/app/account/collections/_components/CollectionsGrid";
import UserDownloadsHistory from "@web/app/account/collections/_components/UserDownloadsHistory";

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

const SortOptions = [
  `Last Modified`,
  `Name (A-Z)`,
] as const;

const Page = async ({ searchParams }: PageProps) => {
  const userCollections = await getUserImageCollections(searchParams);
  const downloads = await getUserImageDownloads();
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
      <CollectionsGrid
        qs={searchParams.qs}
        userCollections={userCollections} />
      <UserDownloadsHistory
        likedImages={new Set(...likedImages.map(i => i.imageId))}
        downloads={downloads} />
    </div>
  );
};

export default Page;
