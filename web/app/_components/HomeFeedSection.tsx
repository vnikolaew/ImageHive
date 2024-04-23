import React from "react";
import { xprisma } from "@/lib/prisma";
import { Image as IImage } from "@prisma/client";
import path from "path";

export interface HomeFeedSectionProps {
}

function getFileName(fullPath: string): string {
   return fullPath.split(`\\`).at(-1)!.trim();
}

const HomeFeedSection = async ({}: HomeFeedSectionProps) => {
   let images = await xprisma.image.findMany({
      orderBy: { createdAt: `desc` },
   });
   console.log(images.map(i => i.dimensions));
   images = [...images, ...images]

   const firstColumn = images.filter((_, index) => index % 4 === 0);
   const secondColumn = images.filter((_, index) => index % 4 === 1);
   const thirdColumn = images.filter((_, index) => index % 4 === 2);
   const fourthColumn = images.filter((_, index) => index % 4 === 3);

   return (
      <section className={`w-full`}>
         <h2 className={`text-2xl px-12`}>
            HomeFeedSection
         </h2>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-12`}>
            <GridColumn images={firstColumn} />
            <GridColumn images={secondColumn} />
            <GridColumn images={thirdColumn} />
            <GridColumn images={fourthColumn} />
         </div>
      </section>
   );
};

export interface GridColumnProps {
   images: IImage[];
}


const GridColumn = ({ images }: GridColumnProps) => {
   const IMAGE_WIDTH = 340;

   return (
      <div className={`grid gap-8`}>
         {images.map(({ absolute_url, id, tags, dimensions: [[x, y]] }, i) => (
            <div
               key={i}
               style={{
                  backgroundImage: `url(${path.join(`/uploads`, getFileName(absolute_url)).replaceAll(`\\`, `/`)})`,
                  backgroundPosition: `center center`,
                  backgroundSize: 'cover',
                  position: 'relative',
                  width: `${IMAGE_WIDTH}px`,
                  height: `${Math.round((IMAGE_WIDTH / x) * y)}px`
               }}
               className={`cursor-pointer group rounded-lg hover:opacity-80 transition-opacity duration-200`}
            >
               <div className={`absolute items-center gap-2 hidden group-hover:flex text-sm bottom-2 left-4 text-neutral-400/90`}>

                  {tags.sort().slice(0, 4).map((tag, i) => (
                     <span key={i}>{tag}</span>
                  ))}
               </div>
            </div>
         ))}
      </div>
   );

};

export default HomeFeedSection;