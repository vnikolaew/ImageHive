"use client";
import React, { useMemo } from "react";
import {
   Dialog, DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { FormField, Form, FormItem, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Check, EyeOff } from "lucide-react";
import useSWR, { MutatorCallback, MutatorOptions } from "swr";
import { ImageCollectionApiResponse } from "@/app/api/collections/route";
import { API_ROUTES, HTTP, TOASTS } from "@/lib/consts";
import { useQsCollectionId } from "@/hooks/useQueryString";
import { ApiResponse } from "@/lib/utils";
import { toast } from "sonner";

const editCollectionSchema = z.object({
   title: z.string().max(100, { message: `Name must not exceed 100 characters.` }),
   public: z.union([z.literal(`true`), z.literal(`false`)]),
});

type FormValues = z.infer<typeof editCollectionSchema>;

export interface EditCollectionModalProps {
   collection?: ImageCollectionApiResponse[0],
   mutate?: <MutationData>(data?: (Promise<MutationData | undefined> | MutatorCallback<MutationData> | MutationData), opts?: (boolean | MutatorOptions<MutationData, MutationData>)) => Promise<MutationData | undefined>
}

export const EditCollectionModalWrapper = ({}) => {
   const { modal, toggleModal, closeModal } = useModals();
   const { data, error, isLoading, mutate } = useSWR<{
      collections: ImageCollectionApiResponse
   }>(API_ROUTES.COLLECTIONS);
   const [collectionId] = useQsCollectionId();

   const currentCollection = useMemo(() => {
      return data?.collections.find(c => c.id === collectionId);
   }, [collectionId, data?.collections]);

   if (modal !== ModalType.EDIT_COLLECTION) return null;

   return <EditCollectionModal collection={currentCollection} />;
};

const EditCollectionModal = ({ collection }: EditCollectionModalProps) => {
   const { toggleModal, closeModal } = useModals();
   const form = useForm<FormValues>({
      resolver: zodResolver(editCollectionSchema),
      defaultValues: {
         public: collection?.public?.toString() ?? `false`,
         title: collection?.title ?? ``,
      },
   });
   const isPublic = form.watch(`public`);

   async function onSubmit(values) {
      console.log({ values });
      fetch(API_ROUTES.COLLECTIONS, {
         method: `PUT`,
         headers: {
            Accept: HTTP.MEDIA_TYPES.APPLICATION_JSON,
            "Content-Type": HTTP.MEDIA_TYPES.APPLICATION_JSON,
         },
         body: JSON.stringify({ collectionId: collection!.id, title: values.title, public: values.public }),
      }).then(res => res.json())
         .then((res: ApiResponse<any>) => {
            console.log({ res });
            if (res.success) {
               closeModal(ModalType.EDIT_COLLECTION);
               const { message, ...rest } = TOASTS.EDIT_COLLECTION_SUCCESS;
               toast(message, { ...rest, icon: <Check size={16} /> });

            }
         })
         .catch(console.error);
   }

   return (
      <Dialog
         onOpenChange={_ => toggleModal(ModalType.EDIT_COLLECTION)}
         open>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[450px] !p-8 !pb-2 min-h-[60vh] !h-fit flex flex-col items-start">
            <DialogHeader className="">
               <DialogTitle className={`text-left text-2xl`}>Edit collection</DialogTitle>
            </DialogHeader>
            <div className="mt-12 w-full flex-1">
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
                        <span
                           className={`dark:text-neutral-300 text-sm`}>
                           {isPublic === `false` ? `This collection will only be visible to you` : `This collection will be visible to everyone on your profile page`}
                        </span>
                     </div>
                     <div className={`w-full !mb-4 flex flex-1 justify-between gap-2 justify-self-end`}>
                        <Button variant={`outline`} onClick={_ => {
                           toggleModal(ModalType.EDIT_COLLECTION);
                        }} className={`rounded-full`} type="button">Cancel</Button>
                        <Button className={`rounded-full !px-6`} type="submit">Save</Button>
                     </div>
                  </form>
               </Form>
            </div>

         </DialogContent>
      </Dialog>
   );
};

export default EditCollectionModal;