import React from "react";
import { ImageSummary } from "@/app/photos/[imageId]/page";

export interface ImageDescriptionProps {
   image: ImageSummary
}

function upperCase(str: string): string {
   return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
}

const ImageDescription = ({image}: ImageDescriptionProps) => {
   return (
      <div className={`mt-8`}>
         <p>{image.tags.map(upperCase).slice(0, 3).join(`, `)} image. Free for use.</p>
      </div>
   );
};

export default ImageDescription;