import React from "react";
import { xprisma } from "@/lib/prisma";
import { GridColumn } from "@/app/_components/GridColumn";
import { sleep } from "@/lib/utils";
import { FeedSortOptions } from "@/app/page";
import { getImageSavesIds, getLikedImageIds } from "@/app/_queries";


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

   const firstColumn = images.filter((_, index) => index % 4 === 0);
   const secondColumn = images.filter((_, index) => index % 4 === 1);
   const thirdColumn = images.filter((_, index) => index % 4 === 2);
   const fourthColumn = images.filter((_, index) => index % 4 === 3);

   return (
      <section className={`w-full mt-8`}>
         <h2 className={`text-2xl px-12`}>
            Home Feed
         </h2>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-12`}>
            {[firstColumn, secondColumn, thirdColumn, fourthColumn].map((column, index) => (
               <GridColumn savedImages={savedImages} likedImageIds={likedImageIds} key={index} images={column} />
            ))}
         </div>
         <div className={`mt-8 w-full flex items-center justify-center`}>Hi</div>
      </section>
   );
};


export default HomeFeedSection;