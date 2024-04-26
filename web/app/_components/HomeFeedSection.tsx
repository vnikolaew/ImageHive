import React, { cache } from "react";
import { xprisma } from "@/lib/prisma";
import { GridColumn } from "@/app/_components/GridColumn";
import { auth } from "@/auth";

export interface HomeFeedSectionProps {
}

export const getImageLikes = cache(async () => {
   const session = await auth();
   return await xprisma.imageLike.findMany({
      where: { userId: session?.user?.id as string },
   });
});

export const getImageSavesIds = cache(async () => {
   const session = await auth();
   const collections = await xprisma.imageCollection.findMany({
      where: { userId: session?.user?.id as string },
      include: { images: { select: { imageId: true } } },
   });
   return new Set(collections.flatMap(c => c.images.map(i => i.imageId)));
});


const HomeFeedSection = async ({}: HomeFeedSectionProps) => {
   let images = await xprisma.image.findMany({
      orderBy: { createdAt: `desc` },
   });

   const [likedImages, savedImages] = await Promise.all([
      getImageLikes(),
      getImageSavesIds(),
   ]);
   console.log({savedImages});
   const likedImageIds = new Set<string>(likedImages.map(i => i.imageId));

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
            <GridColumn savedImages={savedImages} likedImageIds={likedImageIds} key={1} images={firstColumn} />
            <GridColumn savedImages={savedImages} likedImageIds={likedImageIds} key={2} images={secondColumn} />
            <GridColumn savedImages={savedImages} likedImageIds={likedImageIds} key={3} images={thirdColumn} />
            <GridColumn savedImages={savedImages} likedImageIds={likedImageIds} key={4} images={fourthColumn} />
         </div>
      </section>
   );
};


export default HomeFeedSection;