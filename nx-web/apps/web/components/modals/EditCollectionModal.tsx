"use client";
import React, { useMemo } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import {
   API_ROUTES,
   ApiResponse,
   HTTP,
   TOASTS,
} from "@nx-web/shared";
import { useQsCollectionId } from "@web/hooks/useQueryString";
import { usePromise } from "@web/hooks/usePromise";
import { LoadingSpinner } from "./SocialLogins";
import { ImageCollectionApiResponse } from "@web/app/api/collections/route";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@components/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@components/form";
import { Input } from "@components/input";
import { RadioGroup, RadioGroupItem } from "@components/radio-group";
import { Button } from "@components/button";
import {
   useQuery, useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const editCollectionSchema = z.object({
   title: z.string().max(100, { message: `Name must not exceed 100 characters.` }),
   public: z.union([z.literal(`true`), z.literal(`false`)]),
});

type FormValues = z.infer<typeof editCollectionSchema>;

export interface EditCollectionModalProps {
   collection?: ImageCollectionApiResponse[0],
}

export const EditCollectionModalWrapper = ({}) => {
   const { modal, toggleModal, closeModal } = useModals();
   const { data, isLoading, error } = useQuery<{
      collections: ImageCollectionApiResponse
   }>({
      queryKey: [API_ROUTES.COLLECTIONS],
   });

   const [collectionId] = useQsCollectionId();

   const currentCollection = useMemo(() => {
      return data?.collections?.find(c => c.id === collectionId);
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
   const queryClient = useQueryClient();
   const router = useRouter()

   const { loading: deleteLoading, action: handleDeleteCollection } = usePromise(() => {
      return fetch(`${API_ROUTES.COLLECTIONS}/${collection!.id}`, {
         method: `DELETE`,
         headers: {
            Accept: HTTP.MEDIA_TYPES.APPLICATION_JSON,
            "Content-Type": HTTP.MEDIA_TYPES.APPLICATION_JSON,
         },
      }).then(res => res.json())
         .then((res: ApiResponse<any>) => {
            console.log({ res });
            if (res.success) {
               closeModal(ModalType.EDIT_COLLECTION);
               const { message, ...rest } = TOASTS.DELETE_COLLECTION_SUCCESS;
               toast(message, { ...rest, icon: <Check size={16} /> });

               queryClient.setQueryData([API_ROUTES.COLLECTIONS], (data: {
                  collections: ImageCollectionApiResponse
               }) => ({ collections: data.collections.filter(c => c.id !== collection!.id) }));

               router.push(`/account/collections`)
            }
         })
         .catch(console.error);
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
                        {isPublic !== `false` ? <Eye size={12} /> : (
                           <EyeOff size={12} />
                        )}
                        <span
                           className={`dark:text-neutral-300 text-sm`}>
                           {isPublic === `false` ? `This collection will only be visible to you` : `This collection will be visible to everyone on your profile page`}
                        </span>
                     </div>
                     <div className={`w-full !mb-4 flex flex-1 justify-between gap-2 justify-self-end`}>
                        <Button variant={`outline`}
                                onClick={_ => {
                                   toggleModal(ModalType.EDIT_COLLECTION);
                                }} className={`rounded-full`} type="button">Cancel</Button>
                        <div className={`flex items-center gap-2`}>
                           <Button
                              disabled={deleteLoading} onClick={async e => {
                              e.preventDefault();
                              await handleDeleteCollection();

                           }} variant={"destructive"} className={`rounded-full shadow-sm !px-6 gap-2`}
                              type="button">
                              {deleteLoading ? (
                                 <LoadingSpinner text={`Deleting ...`} />
                              ) : (
                                 <>
                                    <TrashIcon size={14} />
                                    Delete
                                 </>
                              )}
                           </Button>
                           <Button className={`rounded-full shadow-sm !px-6`} type="submit">Save</Button>
                        </div>
                     </div>
                  </form>
               </Form>
            </div>

         </DialogContent>
      </Dialog>
   );
};

export default EditCollectionModal;
