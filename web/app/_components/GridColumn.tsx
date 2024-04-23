import React from "react";
import { getImageLikes, GridColumnProps } from "@/app/_components/HomeFeedSection";
import GridColumnImage from "@/app/_components/GridColumnImage";
import { randomUUID } from "node:crypto";

function getFileName(fullPath: string): string {
   return fullPath.split(`\\`).at(-1)!.trim();
}

export const GridColumn = async ({ images }: GridColumnProps) => {
   let likedImages = await getImageLikes();
   const likedImageIds = new Set<string>(likedImages.map(i => i.imageId));

   return (
      <div className={`grid gap-8`}>
         {images.map((image, i) => (
            <GridColumnImage
               likedByMe={likedImageIds.has(image.id)}
               imageUrl={`/uploads/${getFileName(image.absolute_url)}`}
               image={image}
               imageKey={image.id + randomUUID()}
               key={image.id + randomUUID()} />
         ))}
      </div>
   );
};
