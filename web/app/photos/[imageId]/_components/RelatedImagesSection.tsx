import React from "react";
import { GridColumn } from "@/app/_components/GridColumn";
import { sleep } from "@/lib/utils";
import { ImageSummary } from "@/app/photos/[imageId]/_queries";
import { getSimilarImages } from "@/app/photos/[imageId]/_components/_queries";
import { getLikedImageIds } from "@/app/_queries";

export interface RelatedImagesSectionProps {
   image: ImageSummary;
}

const RelatedImagesSection = async ({ image }: RelatedImagesSectionProps) => {
   await sleep(1000);

   const similarImages = await getSimilarImages(image);
   const likedImageIds  = await getLikedImageIds();

   const columns = [
      similarImages.filter((_, index) => index % 3 === 0),
      similarImages.filter((_, index) => index % 3 === 1),
      similarImages.filter((_, index) => index % 3 === 2),
   ];

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