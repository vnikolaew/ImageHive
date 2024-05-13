"use client";
import React, { Fragment, useRef } from "react";
import { Label } from "@components/label";
import { Button } from "@components/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@components/input";
import Link from "next/link";
import { Textarea } from "@components/textarea";
import { Checkbox } from "@components/checkbox";
import { APP_NAME } from "@nx-web/shared";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { FormSchema } from "@web/app/service/report/_components/ReportForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/form";
import { useSingleFileImagePreview } from "@web/hooks/useFileImagePreviews";
import Image from "next/image";

export interface FormStepThreeProps {
   control: Control<FormSchema, any>;
   onBack: () => void;
}

const FormStepThree = ({ control, onBack }: FormStepThreeProps) => {
   const { addImage, removeImage, imagePreview, inputFile } = useSingleFileImagePreview();
   const context = useFormContext<FormSchema>();

   const inputRef = useRef<HTMLInputElement>(null!);

   return (
      <Fragment>
         <h2 className={`text-lg font-semibold flex items-center gap-4`}>
            <Button onClick={onBack} title={`Back`} variant={"ghost"} className={`rounded-full`} size={`icon`}>
               <ArrowLeft size={18} />
            </Button>
            Copyright infringement
         </h2>
         <div className="grid w-full items-center gap-1.5 mt-6">
            <FormField control={control} render={({ field }) => (
               <FormItem>
                  <FormLabel htmlFor="information">
                     <p>
                        Please include the information set out in section 9 of our
                        <Link
                           className={`text-primary !inline pl-1 hover:underline`} href={`/service/terms`}>
                           Terms of Service
                        </Link>
                     </p>
                  </FormLabel>
                  <FormControl>
                     <Textarea id="url" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )
            } name={`information`} />
         </div>
         <div className="grid w-full items-center gap-1.5 mt-6">
            <Label htmlFor="url">
               <p>
                  Add a screenshot of the issue <span className={`text-neutral-500 text-xs pl-1`}>Optional</span>
               </p>
            </Label>
            <div onDragOver={e => {
               e.preventDefault();
            }} onDrop={e => {
               e.preventDefault();
               const file = e.dataTransfer.files[0];
               addImage(file);
               context.setValue(`issueScreenshot`, file);
            }}
                 className={`flex flex-col items-center justify-center mt-2 w-full h-fit !py-8 border-dashed border-[2px] border-slate-300/70 dark:bg-slate-600/60 bg-slate-300/60 rounded-xl text-black dark:text-white shadow-md`}>
               <div className="flex gap-3 items-center">
                  <Button
                     onClick={_ => inputRef?.current?.click()} className={`rounded-full !px-6`}
                     variant={`outline`}>
                     Browse files
                  </Button>
                  <form>
                     <Input
                        accept={`image/*`} onChange={({ target: { files } }) => {
                        addImage(files![0]);
                        context.setValue(`issueScreenshot`, files![0]);
                     }} className={`hidden`} ref={inputRef} type={`file`} hidden />
                  </form>
               </div>
               <div className={`mt-6 text-neutral-400 text-sm flex items-center gap-2 `}>
                  Upload a PNG or JPG file. Max size 10MB.
               </div>
            </div>
            <div>
               {imagePreview?.length && (
                 <div className={`flex items-center gap-4 my-4`}>
                    <Image className={`!h-[120px] rounded-lg shadow-sm !object-cover bg-center-center`} height={100} width={200} src={imagePreview} alt={`image-1`} />
                    <span className={`text-base font-normal`}>{inputFile?.name}</span>
                 </div>
               )}
            </div>
         </div>
         <p className={`mt-4 text-sm font-semibold`}>
            To be notified of the report outcome, please include your name and email address:
         </p>
         <div className="grid w-full items-center gap-1.5 mt-6">
            <FormField control={control} render={({ field }) => (
               <FormItem>
                  <FormLabel htmlFor="name">
                     <p>
                        Enter name
                        <span className={`text-neutral-500 text-xs pl-1`}>Optional</span>
                     </p>
                  </FormLabel>
                  <FormControl>
                     <Input id="name" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )
            } name={`username`} />
         </div>
         <div className="grid w-full items-center gap-1.5 mt-6">
            <FormField control={control} render={({ field }) => (
               <FormItem>
                  <FormLabel htmlFor="email">
                     <p>
                        Enter email address
                        <span className={`text-neutral-500 text-xs pl-1`}>Optional</span>
                     </p>
                  </FormLabel>
                  <FormControl>
                     <Input id="email" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )
            } name={`email`} />
         </div>

         <div>
            <FormField control={control} render={({ field }) => (
               <FormItem className="items-top flex space-x-2 mt-6 hover:text-primary">
                  <FormControl>
                     <Checkbox
                        onCheckedChange={field.onChange}
                        checked={field.value}
                        className={`!rounded-sm`} id="terms" />
                  </FormControl>
                  <FormLabel
                     htmlFor="terms"
                     className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !mt-0"
                  >
                     I agree to {APP_NAME} processing my information as outlined in it’s <Link
                     className={`text-primary`}
                     href={`/service/privacy`}>
                     Privacy policy
                  </Link> .
                  </FormLabel>
                  <FormMessage />
               </FormItem>
            )
            } name={`agreeToProcessingInformation`} />
         </div>
         <div className="items-top flex space-x-2 hover:text-primary">
            <FormField control={control} render={({ field }) => (
               <FormItem className="items-top flex space-x-2 mt-3 hover:text-primary">
                  <FormControl>
                     <Checkbox
                        onCheckedChange={field.onChange} checked={field.value} className={`!rounded-sm`}
                        id="terms2" />
                  </FormControl>
                  <FormLabel
                     htmlFor="terms2"
                     className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 !mt-0"
                  >
                     I have a good faith belief that the information and allegations contained in this report are
                     accurate
                     and complete.
                  </FormLabel>
                  <FormMessage />
               </FormItem>
            )
            } name={`agreeToBelief`} />
         </div>
      </Fragment>
   );
};

export default FormStepThree;
