"use client";
import React from "react";
import Image from "next/image";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleHelp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/app/upload/_store/imageUploadsStore";

export interface UploadImageFormProps {
   inputFile: File,
   imagePreview: string,
   id: string,
   form: UseFormReturn<ImageUpload, any, any>,
   index?: number
}

const UploadImageForm = ({ imagePreview, inputFile, id, form, index }: UploadImageFormProps) => {
   function onSubmit() {

   }

   return (
      <div id={`form-${id}`}
           className={`flex p-0 gap-8 items-start rounded-lg border-[1px] border-neutral-600 bg-white`}>
         <div className={`bg-neutral-100 rounded-l-lg !min-h-[360px] flex items-center justify-center`}>
            <Image className={`rounded-md border-[1px] border-neutral-200`} width={320} height={1000} src={imagePreview}
                   alt={inputFile?.name ?? id} />
         </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 py-4 !pb-8 pr-4 flex flex-col min-w-[600px]">
               <FormField
                  control={form.control}
                  name={`imageUploads.${index}.tags` as const}
                  render={({ field }) => (
                     <FormItem className={`!mt-4 w-full`}>
                        <FormLabel>
                           <div className={`flex items-center gap-2`}>
                              <span className={`font-semibold text-black text-md`}>Tags</span>
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
                              <span className={`text-sm font-light text-neutral-500`}>Enter tags in English.</span>
                           </div>

                        </FormLabel>
                        <FormControl className={`!mt-1 relative w-full`}>
                           <div
                              className={` h-fit flex items-center gap-2 p-1 rounded-md border-[1px] border-neutral-500`}>
                              <div className={`text-black flex-1 text-nowrap gap-2 flex items-center justify-between`}>
                                 {field.value?.filter(s => !!s.length).map((tag: string, i) => (
                                    <Badge variant={`secondary`}
                                           className={`!h-full bg-neutral-200 text-black font-normal flex items-center gap-1 hover:!bg-neutral-300`}
                                           key={i}>
                                       <span>{tag}</span>
                                       <X onClick={_ => {
                                          console.log(field.value, field.name, tag);

                                          form.setValue(`imageUploads.${index}.tags`, field?.value?.filter(s => s !== tag));
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
                                    console.log(`we are here`);
                                    field.onChange(e);
                                    form.setValue(`imageUploads.${index}.tags`, e.target.value.split(`,`).map(s => s.trim()));
                                    form.trigger(`imageUploads.${index}.tags`);
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
                  name={`imageUploads.${index}.description` as const}
                  render={({ field }) => (
                     <FormItem className={`!mt-8`}>
                        <FormLabel>
                           <div className={`flex items-center justify-between w-full`}>
                              <div className={`flex items-center gap-2`}>
                                 <span className={`font-semibold text-black text-md`}>Description</span>
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
                                 <span className={`text-sm font-light text-neutral-500`}>Optional</span>
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
                  name={`imageUploads.${index}.aiGenerated` as const}
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
            </form>
         </Form>
      </div>
   );
};

export default UploadImageForm;