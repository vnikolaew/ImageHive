import { parseAsString, useQueryState } from "nuqs";

export function useQsImageId() {
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

