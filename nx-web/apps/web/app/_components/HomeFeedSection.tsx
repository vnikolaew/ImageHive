import React from "react";
import { FeedSortOptions } from "../page";
import { sleep } from "@nx-web/shared";
import { xprisma } from "@nx-web/db";
import { GridColumn } from "./GridColumn";
import { getImageSavesIds, getLikedImageIds } from "../_queries";


interface HomeFeedSectionProps {
   hideAi?: boolean,
   order: (typeof FeedSortOptions)[number]
}

const HomeFeedSection = async ({ hideAi, order }: HomeFeedSectionProps) => {
   await sleep(3_000);
   let images: any[];
   switch (order) {
      case `Latest`:
         images = await xprisma.image.homeFeedRaw_Latest();
         break;
      case `Trending`:
         images = await xprisma.image.homeFeedRaw();
         break;
      default:
         images = await xprisma.image.homeFeedRaw();
         break;
   }
   console.log({ images });

   const [likedImageIds, savedImages] = await Promise.all([
      getLikedImageIds(),
      getImageSavesIds(),
   ]);

   images = (hideAi ? [...images].filter(i => !i.metadata?.aiGenerated) : images);

   const columns = Array
      .from({ length: 4 })
      .map((_, i) => i)
      .map(x => images.filter((_, index) => index % 4 === x));

   return (
      <section className={`w-full mt-8`}>
         <h2 className={`text-2xl px-12`}>
            Home Feed
         </h2>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-12`}>
            {columns.map((column, index) => (
               <GridColumn savedImages={savedImages} likedImageIds={likedImageIds} key={index} images={column} />
            ))}
         </div>
         <div className={`mt-8 w-full flex items-center justify-center`}></div>
      </section>
   );
};


export default HomeFeedSection;
