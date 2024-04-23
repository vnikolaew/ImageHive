import React, { cache } from "react";
import { xprisma } from "@/lib/prisma";
import { Image as IImage } from "@prisma/client";
import { GridColumn } from "@/app/_components/GridColumn";
import { auth } from "@/auth";
import { cloneDeep } from "lodash";

export interface HomeFeedSectionProps {
}

export const getImageLikes = cache(async () => {
   const session = await auth();
   return await xprisma.imageLike.findMany({
      where: { userId: session?.user?.id as string },
   });
});


const HomeFeedSection = async ({}: HomeFeedSectionProps) => {
   let images = await xprisma.image.findMany({
      orderBy: { createdAt: `desc` },
   });

   let likedImages = await getImageLikes();
   images = [...images];

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
            <GridColumn key={1} images={firstColumn} />
            <GridColumn key={2} images={secondColumn} />
            <GridColumn key={3} images={thirdColumn} />
            <GridColumn key={4} images={fourthColumn} />
         </div>
      </section>
   );
};

export interface GridColumnProps {
   images: (IImage & { dimensions: number[][] })[];
}


export default HomeFeedSection;