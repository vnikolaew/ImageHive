import React from "react";
import { ImageCollectionItem } from "@/app/account/collections/page";
import CollectionsGridItem from "./CollectionsGridItem";

export interface CollectionsGridProps {
   userCollections: ImageCollectionItem[];
}

const CollectionsGrid = ({ userCollections }: CollectionsGridProps) => {
   return (
      <div className={`grid gap-4`}>
         {userCollections.map((collection, i) => (
            <CollectionsGridItem userCollection={collection} key={i} />
         ))}
      </div>
   );
};

export default CollectionsGrid;