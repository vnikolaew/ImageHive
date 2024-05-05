"use client";
import React, { useCallback } from "react";
import CollectionsGridItem from "./CollectionsGridItem";
import { parseAsString, useQueryState } from "nuqs";
import { useQsCollectionTab } from "@web/hooks/useQueryString";
import { ImageCollectionItem } from "@web/app/account/collections/page";

export interface CollectionsGridProps {
   userCollections: ImageCollectionItem[],
   qs?: string | undefined
}

const SortOptions = [
  `Last Modified`,
  `Name (A-Z)`,
] as const;

const CollectionsGrid = ({ userCollections, qs }: CollectionsGridProps) => {
   const [selectedTab, setSelectedTab] = useQsCollectionTab();
   const [sort, setSort] = useQueryState<(typeof SortOptions)[number]>(`sort`,
      // @ts-ignore
      parseAsString.withOptions({
         history: `push`,
      }));

   const sorter = useCallback((a: ImageCollectionItem, b: ImageCollectionItem) => {
      if (sort === `Last Modified`) {
         return new Date(b.updatedAt) - new Date(a.updatedAt);
      } else return a.title.localeCompare(b.title);
   }, [sort]);

   if (selectedTab && selectedTab !== `collections`) return null;

   if (userCollections?.length === 0) return (
      <div className={`w-full text-center mt-8 text-xl font-semibold`}>No collections matching &quot;{qs}&quot;</div>
   );

   return (
      <div className={`grid gap-8`}>
         {userCollections.sort(sorter).map((collection, i) => (
            <CollectionsGridItem userCollection={collection} key={i} />
         ))}
      </div>
   );
};

export default CollectionsGrid;
