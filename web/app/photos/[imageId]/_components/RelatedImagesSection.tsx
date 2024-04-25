import React from "react";
import { xprisma } from "@/lib/prisma";
import { ImageSummary } from "@/app/photos/[imageId]/page";
import { groupBy } from "lodash";
import { getImageLikes } from "@/app/_components/HomeFeedSection";
import { GridColumn } from "@/app/_components/GridColumn";
import { sleep } from "@/lib/utils";

export interface RelatedImagesSectionProps {
   image: ImageSummary;
}

const RelatedImagesSection = async ({ image }: RelatedImagesSectionProps) => {
   await sleep(1000);

   const similarImages = await xprisma.image.findSimilarImages(image, 10);
   const likedImages = await getImageLikes();
   const likedImageIds = new Set<string>(likedImages.map(i => i.imageId));

   const images = Object
      .entries(groupBy(similarImages, `id`))
      .sort((a, b) => b[1].length - a[1].length)
      .map(x => x[1][0])
      .filter(i => i.id !== image.id);

   const columns = [
      images.filter((_, index) => index % 3 === 0),
      images.filter((_, index) => index % 3 === 1),
      images.filter((_, index) => index % 3 === 2),
   ];

   console.log({ images, likedImages });

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