import React from "react";
import { xprisma } from "@/lib/prisma";
import { GridColumn } from "@/app/_components/GridColumn";
import { getImageLikes } from "@/app/_components/HomeFeedSection";

export interface SearchResultsSectionProps {
   search: string;
}

const SearchResultsSection = async ({ search }: SearchResultsSectionProps) => {
   search = search.toLowerCase();
   const imageHits: any[] = await xprisma.image.search(search)
   const tags = await xprisma.image.mostUsedTags()
   const likedImages = await getImageLikes();
   const likedImageIds = new Set<string>(likedImages.map(i => i.imageId));

   console.log( { imageHits, tags })

   const firstColumn = imageHits.filter((_, index) => index % 4 === 0);
   const secondColumn = imageHits.filter((_, index) => index % 4 === 1);
   const thirdColumn = imageHits.filter((_, index) => index % 4 === 2);
   const fourthColumn = imageHits.filter((_, index) => index % 4 === 3);

   return (
      <div className={`p-8 flex items-start flex-col gap-4 px-24`}>
         <h2 className={`text-3xl font-semibold`}>
            {`${search[0].toUpperCase()}${search.slice(1).toLowerCase()}`} Images & Pictures
         </h2>
         <p className={`text-sm font-normal text-neutral-500`}>
            {imageHits.length}+ beautiful {search} photos & stock images. Download your favorite royalty free {search} pictures in HD
            to 4K quality as wallpapers,
            backgrounds & more.
         </p>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-0`}>
            <GridColumn likedImageIds={likedImageIds} key={1} images={firstColumn} />
            <GridColumn likedImageIds={likedImageIds} key={2} images={secondColumn} />
            <GridColumn likedImageIds={likedImageIds} key={3} images={thirdColumn} />
            <GridColumn likedImageIds={likedImageIds} key={4} images={fourthColumn} />
         </div>

      </div>
   );
};

export default SearchResultsSection;