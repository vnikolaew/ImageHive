"use client";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/app/upload/_store/imageUploadsStore";

export interface ImagePreviewsSectionProps {
   selectedImageId?: string,
   setSelectedImageId: Dispatch<SetStateAction<string>>,
   imageUploads: ImageUpload[]
}

const ImagePreviewsSection = ({
                                 selectedImageId,
                                 setSelectedImageId,
                                 imageUploads,
                              }: ImagePreviewsSectionProps) => {

   const imagePreviews = useMemo(() => {
      return new Map(imageUploads?.map(u => [u.id, u.imagePreview]));
   }, [imageUploads]);

   return (
      <div className={`flex flex-col gap-2 items-center sticky top-8 z-10`}>
         {[...imagePreviews.entries()].map(([id, preview], i) => (
            <div
               onClick={_ => setSelectedImageId(id)}
               className={cn(`p-2 border-[1px] cursor-pointer hover:border-neutral-500 border-transparent rounded-lg transition-colors duration-100`,
                  id === selectedImageId && `!border-green-600 !border-[2px]`)}
               key={id}>
               {/*<Image height={64} width={64} src={preview} alt={``} />*/}
               <div style={{
                  backgroundImage: `url(${preview})`,
                  backgroundSize: `cover`,
                  backgroundPosition: `center`,
                  width: `60px`,
                  backgroundRepeat: `no-repeat`,
                  height: `60px`,
               }
               } />
            </div>
         ))}
      </div>
   );
};

export default ImagePreviewsSection;