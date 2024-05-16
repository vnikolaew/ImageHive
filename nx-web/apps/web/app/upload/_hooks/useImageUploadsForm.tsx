"use client"
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCallback } from "react";

export const uploadImageFormSchema = z.object({
   inputFile: z.instanceof(File).nullable(),
   imagePreview: z.string(),
   id: z.string(),
   tags: z.array(z.string()),
   description: z.string().nullable(),
   aiGenerated: z.boolean(),
});

export const uploadImagesFormSchema = z.object({
   imageUploads: z.array(z.object({
      inputFile: z.instanceof(File),
      imagePreview: z.string(),
      id: z.string(),
      tags: z.array(z.string()),
      description: z.string(),
      aiGenerated: z.boolean(),
   })),
});

export type UploadImageFormValues = z.infer<typeof uploadImagesFormSchema>

export type UploadSingleImageFormValues = z.infer<typeof uploadImageFormSchema>

export function useImageUploadsForm() {
   const form = useForm<UploadImageFormValues>({
      resolver: zodResolver(uploadImagesFormSchema),
      reValidateMode: `onChange`,
      defaultValues: {
         imageUploads: [],
      },
   });
   const { append, remove, update } = useFieldArray({
      control: form.control,
      name: "imageUploads",
   });
   const fields = form.watch(`imageUploads`);

   const addImage = useCallback((imageFile: File) => {
      const id = crypto.randomUUID();
      append({
         id, aiGenerated: false, description: ``, tags: [], inputFile: imageFile, imagePreview: ``,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
         // @ts-ignore
         const fields = form.getValues(`imageUploads`);
         console.log({ fields });
         const index = fields.findIndex(f => f.id === id);
         console.log(`Found index: ${index}, ID is: ${id}`);

         if (index < 0) return;
         update(index, { ...fields[index], imagePreview: reader.result as string });
      };
      reader.readAsDataURL(imageFile);
   }, [append, fields, form, update]);

   const removeImage = useCallback((id: string) => {
      // @ts-ignore
      const index = fields.findIndex(f => f.id === id);
      remove(index);
   }, [fields, remove]);

   return { form, addImage, removeImage, imageUploads: fields, reset: form.reset } as const;
}
