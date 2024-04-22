"use client";
import React from "react";
import { Image } from "@prisma/client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, CircleHelp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   uploadImageFormSchema,
   UploadSingleImageFormValues,
} from "@/app/upload/_hooks/useImageUploadsForm";
import { Button } from "@/components/ui/button";
import { handleUpdateMedia } from "@/app/account/media/actions";
import { toast } from "sonner";
import { TOASTS } from "@/lib/consts";
import { usePromise } from "@/hooks/usePromise";
import { ImageUpload } from "@/app/upload/_store/imageUploadsStore";
import { LoadingSpinner } from "@/components/modals/SocialLogins";

interface EditMediaFormProps {
   image: Image,
   onClose: (_: any) => void
}

const EditMediaForm = ({ image, onClose }: EditMediaFormProps) => {
   const form = useForm<UploadSingleImageFormValues>({
      resolver: zodResolver(uploadImageFormSchema),
      reValidateMode: `onChange`,
      defaultValues: {
         id: image.id,
         imagePreview: ``,
         tags: image.tags,
         aiGenerated: false,
         description: image.title ?? undefined,
         inputFile: null!,
      },
   });
   const { loading, action: handleUpdateMediaAction } = usePromise(async (payload: Partial<ImageUpload>) => {
      return await handleUpdateMedia(payload);
   });

   async function onSubmit(values: UploadSingleImageFormValues) {
      console.log({ values });
      //@ts-ignore
      handleUpdateMediaAction({ ...values, inputFile: undefined })
         .then(res => {
            if (res.success) {
               const { message, ...rest } = TOASTS.UPDATE_IMAGE_SUCCESS;
               toast(message, { ...rest, icon: <Check size={16} /> });
               onClose(null!);
            }
         })
         .catch(console.error);
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}
               className="py-4 !pb-4 pr-4 flex flex-col !w-full">
            <FormField
               control={form.control}
               name={`tags`}
               render={({ field }) => (
                  <FormItem className={`!mt-4 w-fit`}>
                     <FormLabel>
                        <div className={`flex items-center gap-2`}>
                           <span className={`font-semibold text-neutral-300 text-lg`}>Tags</span>
                           <TooltipProvider>
                              <Tooltip>
                                 <TooltipTrigger className={`cursor-auto`}>
                                    <CircleHelp className={`text-neutral-500`} size={16} />
                                 </TooltipTrigger>
                                 <TooltipContent className={`!text-xs rounded-lg bg-black text-white`}>
                                    Add at least 3 keywords to help users understand your media.
                                 </TooltipContent>
                              </Tooltip>
                           </TooltipProvider>
                           <span className={`text-sm font-light text-neutral-400`}>Enter tags in English.</span>
                        </div>

                     </FormLabel>
                     <FormControl className={`!mt-1 relative w-fit`}>
                        <div
                           className={`h-fit flex items-center w-fit flex-wrap gap-2 p-1 rounded-md border-[1px] bg-white border-neutral-500`}>
                           <div className={`text-black flex-1 text-nowrap flex-wrap gap-2 flex items-center justify-start`}>
                              {field.value?.filter(s => !!s.length).map((tag: string, i) => (
                                 <Badge variant={`secondary`}
                                        className={`!h-full bg-neutral-200 text-black font-normal flex items-center gap-1 hover:!bg-neutral-300`}
                                        key={i}>
                                    <span>{tag}</span>
                                    <X onClick={_ => {
                                       form.setValue(`tags`, field?.value?.filter(s => s !== tag));
                                    }} className={`cursor-pointer text-muted hover:text-neutral-800`} size={12} />
                                 </Badge>
                              ))}
                           </div>
                           <Input
                              className={`text-black !py-0 bg-white flex-0 !border-0 !shadow-none !outline-none focus:!outline-none focus:!border-0 focus:!ring-0 !h-7`}
                              type={`text`}
                              required
                              placeholder="e.g. jack123 or jack123@example.com"
                              {...field}
                              onChange={e => {
                                 field.onChange(e);
                                 form.setValue(`tags`, e.target.value.split(`,`).map(s => s.trim()));
                                 form.trigger(`tags`);
                              }}
                           />
                        </div>
                     </FormControl>
                     <FormDescription>
                     </FormDescription>
                     <FormMessage className={`dark:text-red-400 font-normal !mt-0`} />
                  </FormItem>
               )}
            />

            <FormField
               control={form.control}
               name={`description`}
               render={({ field }) => (
                  <FormItem className={`!mt-8`}>
                     <FormLabel>
                        <div className={`flex items-center justify-between w-full`}>
                           <div className={`flex items-center gap-2`}>
                              <span className={`font-semibold text-neutral-300 text-lg`}>Description</span>
                              <TooltipProvider>
                                 <Tooltip>
                                    <TooltipTrigger className={`cursor-auto`}>
                                       <CircleHelp className={`text-neutral-500`} size={16} />
                                    </TooltipTrigger>
                                    <TooltipContent className={`!text-xs rounded-lg bg-black text-white`}>
                                       Adding a description will help users understand your media.
                                    </TooltipContent>
                                 </Tooltip>
                              </TooltipProvider>
                              <span className={`text-sm font-light text-neutral-400`}>Optional</span>
                           </div>
                           <div className={`text-neutral-500 font-normal mr-2 text-xs`}>
                              {field?.value?.length}/300
                           </div>
                        </div>

                     </FormLabel>
                     <FormControl className={`!mt-1`}>
                        <Input
                           className={`text-black bg-white`}
                           type={`text`}
                           placeholder="Add an optional description"
                           {...field}
                        />
                     </FormControl>
                     <FormDescription>
                     </FormDescription>
                     <FormMessage className={`dark:text-red-400`} />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name={`aiGenerated`}
               render={({ field }) => (
                  <FormItem className={`!mt-8 flex items-center gap-3`}>
                     <FormControl className={`!mt-1 `}>
                        <Switch
                           className={`!bg-neutral-300 data-[state=checked]:!bg-primary`}
                           checked={field.value}
                           onCheckedChange={field.onChange}
                        />
                     </FormControl>
                     <FormLabel className={`text-neutral-500 !mt-0 font-normal text-md`}>
                        This media is AI generated
                     </FormLabel>
                     <TooltipProvider>
                        <Tooltip>
                           <TooltipTrigger className={`cursor-auto !mt-0`}>
                              <CircleHelp className={`text-neutral-500`} size={16} />
                           </TooltipTrigger>
                           <TooltipContent className={`!text-xs rounded-lg bg-black text-white`}>
                              You must disclose if this content is created using AI
                           </TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                     <FormDescription>
                     </FormDescription>
                     <FormMessage className={`dark:text-red-400`} />
                  </FormItem>
               )}
            />
            <div className={` items-center flex justify-between mt-12`}>
               <Button
                  className={`rounded-full !px-8`}
                  type={`button`}
                  onClick={e => {
                     e.preventDefault();
                     onClose(e);
                  }} variant={`ghost`} size={`default`}>
                  Close
               </Button>
               <Button
                  disabled={loading}
                  type={`submit`}
                  className={`rounded-full !px-8 shadow-md`}
                  variant={`default`}
                  size={`lg`}>
                  {loading ? <LoadingSpinner text={`Saving ...`} />: `Save`}
               </Button>
            </div>
         </form>
      </Form>
   );
};

export default EditMediaForm;