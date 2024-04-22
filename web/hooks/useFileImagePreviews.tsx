import { useMap } from "@/hooks/useMap";
import { v4 as uuid } from "uuid";

export function useFileImagePreviews() {
   const [inputFiles, inputFilesActions] =
      useMap<string, File>();
   const [imagePreviews, imagePreviewsActions] =
      useMap<string, string>();

   const addImage = (imageFile: File) => {
      const id = uuid();
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