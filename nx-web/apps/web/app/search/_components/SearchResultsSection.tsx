import React from "react";
import { getLikedImageIds } from "@web/app/_queries";
import SimilarTagsSection from "./SimilarTagsSection";
import { GridColumn } from "@web/app/_components/GridColumn";
import { getImagesFromSearch } from "@web/app/search/_queries";

export interface SearchResultsSectionProps {
   search: string;
   params: Record<string, string>;
}

const SearchResultsSection = async ({ search, params }: SearchResultsSectionProps) => {
   let imageHits = await getImagesFromSearch(search, params)
   const likedImageIds = await getLikedImageIds();

   const columns = Array
      .from({ length: 4 })
      .map((_, i) => i)
      .map(x => imageHits.filter((_, index) => index % 4 === x));

   console.log({ tags: imageHits.map(i => i.tags) });

   return (
      <div className={`p-8 flex items-start flex-col gap-4 px-24`}>
         <h2 className={`text-3xl font-semibold`}>
            {`${search[0].toUpperCase()}${search.slice(1).toLowerCase()}`} Images & Pictures
         </h2>
         <p className={`text-sm font-normal text-neutral-500`}>
            {imageHits.length}+ beautiful {search} photos & stock images. Download your favorite royalty
            free {search} pictures in HD
            to 4K quality as wallpapers,
            backgrounds & more.
         </p>
         <div className={`mt-4`}>
            <SimilarTagsSection tag={search} />
         </div>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-0`}>
            {columns.map((column, index) => (
               <GridColumn likedImageIds={likedImageIds} key={index + 1} images={column} />
            ))}
         </div>

      </div>
   );
};

export default SearchResultsSection;
