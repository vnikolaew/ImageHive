"use client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import {
  API_ROUTES,
  ApiResponse,
  HTTP,
  TOASTS
} from "@nx-web/shared";
import { Check, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/dialog";
import { FormControl, FormDescription, FormField, FormItem, Form, FormLabel, FormMessage } from "@components/form";
import { Input } from "@components/input";
import { RadioGroup, RadioGroupItem } from "@components/radio-group";
import { Button } from "@components/button";
import { useQueryClient } from "@tanstack/react-query";
import { ImageCollectionApiResponse } from "@web/app/api/collections/route";

export interface CreateNewCollectionModalProps {
}

const createCollectionSchema = z.object({
   title: z.string().max(100, { message: `Name must not exceed 100 characters.` }),
   public: z.union([z.literal(`true`), z.literal(`false`)]),
});

type FormValues = z.infer<typeof createCollectionSchema>;

const CreateNewCollectionModal = ({}: CreateNewCollectionModalProps) => {
   const { modal, toggleModal, closeModal } = useModals();
   const queryClient = useQueryClient()
   const form = useForm<FormValues>({
      resolver: zodResolver(createCollectionSchema),
      defaultValues: {
         public: `false`,
         title: ``,
      },
   });
   if (modal !== ModalType.CREATE_NEW_COLLECTION) return null;

   async function onSubmit(values: FormValues) {
      console.log({ values });
      fetch(API_ROUTES.COLLECTIONS, {
         method: `POST`,
         headers: {
            Accept: HTTP.MEDIA_TYPES.APPLICATION_JSON,
            "Content-Type": HTTP.MEDIA_TYPES.APPLICATION_JSON,
         },
         body: JSON.stringify({ imageId: null, title: values.title, public: values.public }),
      }).then(res => res.json())
         .then((res: ApiResponse<any>) => {
            console.log({ res });
            if(res.success) {
               closeModal(ModalType.CREATE_NEW_COLLECTION);
               const { message, ...rest } = TOASTS.CREATE_COLLECTION_SUCCESS;
               toast(message, { ...rest, icon: <Check size={16} /> });

               console.log(queryClient.getQueryData([API_ROUTES.COLLECTIONS]));
               queryClient.setQueryData([API_ROUTES.COLLECTIONS], (data: { collections: ImageCollectionApiResponse }) => {
                  return  { collections: [...data.collections, res.data] };
               })
            }
         })
         .catch(console.error);
   }

   return (
      <Dialog
         onOpenChange={_ => toggleModal(ModalType.CREATE_NEW_COLLECTION)}
              open>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[450px] !p-8 !pb-2 min-h-[60vh] !h-fit flex flex-col items-start">
            <DialogHeader className="">
               <DialogTitle className={`text-left text-2xl`}>Create new collection</DialogTitle>
            </DialogHeader>
            <div className="mt-4 w-full flex-1">
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 !h-full">
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Collection name</FormLabel>
                              <FormControl>
                                 <Input placeholder="" {...field} />
                              </FormControl>
                              <FormDescription>
                                 Choose a descriptive title.
                              </FormDescription>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <FormField
                        control={form.control}
                        name="public"
                        render={({ field }) => (
                           <FormItem className="space-y-3 ">
                              <FormControl className={`mt-12`}>
                                 <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-3 "
                                 >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                       <FormControl>
                                          <RadioGroupItem value="false" />
                                       </FormControl>
                                       <FormLabel className="font-normal">
                                          Private
                                       </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                       <FormControl>
                                          <RadioGroupItem value="true" />
                                       </FormControl>
                                       <FormLabel className="font-normal">
                                          Public
                                       </FormLabel>
                                    </FormItem>
                                 </RadioGroup>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="flex items-center space-x-3">
                        <EyeOff size={12} />
                        <span className={`dark:text-neutral-300 text-sm`}>This collection will only be visible to you</span>
                     </div>
                     <div className={`w-full flex flex-1 !mb-2 justify-end gap-2 justify-self-end`}>
                        <Button variant={`outline`} onClick={_ => {
                           toggleModal(ModalType.CREATE_NEW_COLLECTION);
                        }} className={`rounded-full`} type="button">Cancel</Button>
                        <Button className={`rounded-full`} type="submit">Create collection</Button>
                     </div>
                  </form>
               </Form>
            </div>

         </DialogContent>
      </Dialog>
   );
};

export default CreateNewCollectionModal;
