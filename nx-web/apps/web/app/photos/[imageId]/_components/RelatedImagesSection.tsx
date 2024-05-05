import React from "react";
import { ImageSummary } from "../_queries";
import { sleep } from "@utils";
import { getSimilarImages } from "./_queries";
import { getLikedImageIds } from "../../../_queries";
import { GridColumn } from "../../../_components/GridColumn";

export interface RelatedImagesSectionProps {
   image: ImageSummary;
}

const RelatedImagesSection = async ({ image }: RelatedImagesSectionProps) => {
   await sleep(1000);

   const similarImages = await getSimilarImages(image);
   const likedImageIds  = await getLikedImageIds();

   const columns = Array
      .from({ length: 3 })
      .map((_, i) => i)
      .map(x => similarImages.filter((_, index) => index % 4 === x));

   return (
      <div className={`mt-12`}>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Similar images
         </h2>
         <div className={`w-full grid grid-cols-3 gap-8 mt-4`}>
            {columns.map((c, i) => (
               <GridColumn key={i} images={c as any[]} likedImageIds={likedImageIds} />
            ))}
         </div>

      </div>
   );
};

export default RelatedImagesSection;
