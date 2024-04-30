import React from "react";
import GridColumnImage from "@/app/_components/GridColumnImage";
import { randomUUID } from "node:crypto";
import { Image as IImage } from "@prisma/client";
import { isAbsoluteUrl } from "@/lib/utils";

function getFileName(fullPath: string): string {
   return fullPath.split(`\\`).at(-1)!.trim();
}

export interface GridColumnProps {
   images: (IImage & { dimensions: number[][] })[],
   likedImageIds: Set<string>,
   savedImages?: Set<string>
}

export const GridColumn = async ({ images, likedImageIds, savedImages }: GridColumnProps) => {
   return (
      <div className={`grid gap-8`}>
         {images.map((image, i) => (
            <GridColumnImage
               savedByMe={savedImages?.has(image.id)}
               likedByMe={likedImageIds.has(image.id)}
               imageUrl={isAbsoluteUrl(image.absolute_url) ? image.absolute_url : `/uploads/${getFileName(image.absolute_url)}`}
               image={image}
               imageKey={image.id + randomUUID()}
               key={image.id + randomUUID()} />
         ))}
      </div>
   );
};
