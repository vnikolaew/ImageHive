import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { useCallback } from "react";

const uploadImagesFormSchema = z.object({
   imageUploads: z.array(z.object({
      inputFile: z.instanceof(File),
      imagePreview: z.string(),
      id: z.string(),
      tags: z.array(z.string()),
      description: z.string(),
      aiGenerated: z.boolean(),
   })),
});

type UploadImageFormValues = z.infer<typeof uploadImagesFormSchema>

export function useImageUploadsForm() {
   const form = useForm<UploadImageFormValues>({
      resolver: zodResolver(uploadImagesFormSchema),
      reValidateMode: `onChange`,
      defaultValues: {
         imageUploads: [],
      },
   });
   const { fields, append, remove, update } = useFieldArray({
      control: form.control,
      name: "imageUploads",
   });

   const addImage = useCallback((imageFile: File) => {
      const id = uuid();
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
      const index = fields.indexOf(f => f.id === id);
      remove(index);
   }, [fields, remove]);

   // const imageUploads = useWatch({ control: form.control, name: `imageUploads` });

   return { form, addImage, removeImage, imageUploads: fields } as const;
}