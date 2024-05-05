"use client"
import { parseAsString, useQueryState } from "nuqs";

export function useQueryString() {
   const [imageId, setImageId] = useQueryState<string>(`imageId`,
      parseAsString.withOptions({
         history: `push`,
      }));

   return [imageId, setImageId] as const;
}

export function useQsCollectionId() {
   const [collectionId, setCollectionId] = useQueryState<string>(`collectionId`,
      parseAsString.withOptions({
         history: `push`,
      }));

   return [collectionId, setCollectionId] as const;
}

export function useQsCollectionTab() {
   const [collectionTab, setCollectionTab] = useQueryState<string>(`tab`,
      parseAsString.withOptions({
         history: `push`,
      }));

   return [collectionTab, setCollectionTab] as const;
}

