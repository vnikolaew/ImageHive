import React from "react";
import { xprisma } from "@/lib/prisma";

export interface SearchResultsSectionProps {
   search: string;
}

const SearchResultsSection = async ({ search }: SearchResultsSectionProps) => {
   search = search.toLowerCase();
   const images = await xprisma.image.findMany({
      where: {
         OR: [
            {
               tags: {
                  hasSome: [search.toLowerCase()],
               },
            },
            {
               title: {
                  search: search.toLowerCase(),
               },
            },
         ],
      },
   });

   const result = await xprisma.image.search(search)
   const tags = await xprisma.image.mostUsedTags()
   console.log( { result, tags })

   return (
      <div className={`p-8 flex items-start flex-col gap-4`}>
         <h2 className={`text-3xl font-semibold`}>
            {`${search[0].toUpperCase()}${search.slice(1).toLowerCase()}`} Images & Pictures
         </h2>
         <p className={`text-sm font-normal text-neutral-500`}>
            8,000+ beautiful {search} photos & stock images. Download your favorite royalty free {search} pictures in HD
            to 4K quality as wallpapers,
            backgrounds & more.
         </p>
      </div>
   );
};

export default SearchResultsSection;