import React from "react";
import GridColumnImage from "@/app/_components/GridColumnImage";
import { randomUUID } from "node:crypto";
import { Image as IImage } from "@prisma/client";

function getFileName(fullPath: string): string {
   return fullPath.split(`\\`).at(-1)!.trim();
}

export interface GridColumnProps {
   images: (IImage & { dimensions: number[][] })[];
   likedImageIds: Set<string>
}

export const GridColumn = async ({ images, likedImageIds }: GridColumnProps) => {
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
