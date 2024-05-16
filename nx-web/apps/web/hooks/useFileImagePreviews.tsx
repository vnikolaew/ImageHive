"use client"
import { useMap } from "./useMap";
import { useState } from "react";

export function useFileImagePreviews() {
   const [inputFiles, inputFilesActions] =
      useMap<string, File>();
   const [imagePreviews, imagePreviewsActions] =
      useMap<string, string>();

   const addImage = (imageFile: File) => {
      const id = crypto.randomUUID();
      inputFilesActions.set(id, imageFile);

      const reader = new FileReader();
      reader.onloadend = () => {
         imagePreviewsActions.set(id, reader.result as string);
      };
      reader.readAsDataURL(imageFile);
   };

   const removeImage = (id: string) => {
      inputFilesActions.remove(id);
      imagePreviewsActions.remove(id);
   };


   return { inputFiles, imagePreviews, addImage, removeImage } as const;
}

export function useSingleFileImagePreview() {
   const [inputFile, setInputFile] =
      useState<File>(null!);

   const [imagePreview, setImagePreview] =
      useState<string>(null!);

   const addImage = (imageFile: File) => {
      setInputFile(imageFile);

      const reader = new FileReader();
      reader.onloadend = () => {
         setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
   };

   const removeImage = () => {
      setInputFile(null!);
      setImagePreview(null!);
   };


   return { inputFile, imagePreview, addImage, removeImage } as const;
}
