"use client";
import React, { Fragment, useRef } from "react";
import { CircleHelp } from "lucide-react";
import { useImageUploadsForm } from "../_hooks/useImageUploadsForm";
import ImagesUploadSection from "./ImagesUploadSection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { APP_NAME } from "@nx-web/shared";

export interface FileDropzoneProps {
   uploadsRemaining: number;
}


const FileDropzone = ({ uploadsRemaining }: FileDropzoneProps) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const { form, addImage, removeImage, imageUploads, reset } = useImageUploadsForm();

   return (
      <Fragment>
         <div onDragOver={e => {
            e.preventDefault();
         }} onDrop={e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            addImage(file);
         }}
              className={`flex flex-col items-center justify-center mt-12 w-1/2 h-[200px] border-dashed border-[2px] border-slate-300/70 dark:bg-slate-600/60 bg-slate-300/60 rounded-xl text-black dark:text-white shadow-md`}>
            <div className="flex gap-3 items-center">
               <h2 className={`text-lg font-bold`}>Drag and drop media or</h2>
               <Button onClick={_ => inputRef?.current?.click()} className={`rounded-full !px-6`} variant={`default`}>Browse
                  files</Button>
               <form>
                  <Input accept={`image/*`} onChange={({ target: { files } }) => {
                     addImage(files![0]);
                  }} className={`hidden`} ref={inputRef} type={`file`} hidden />
               </form>
            </div>
            <div className={`mt-6 text-neutral-400 flex items-center gap-2 `}>
               <span className={`text-sm`}>
                  {uploadsRemaining} uploads remaining for this week
               </span>
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger className={`cursor-auto`}>
                        <CircleHelp size={16} />
                     </TooltipTrigger>
                     <TooltipContent className={`bg-neutral-800 !text-xs text-white rounded-lg`}>
                        <b>{APP_NAME}</b> limits weekly uploads.
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </div>
         </div>
         <div className={`dark:text-white text-black mt-4`}>
            <ImagesUploadSection reset={reset} removeImage={removeImage} imageUploads={imageUploads} form={form} />
         </div>
      </Fragment>
   );
};

export default FileDropzone;
