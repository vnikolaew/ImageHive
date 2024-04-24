"use client";
import React, { useState } from "react";
import { ImageUpload } from "@/app/upload/_store/imageUploadsStore";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
   Dialog,
   DialogContent,
   DialogDescription, DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { UseFormReturn } from "react-hook-form";

export interface DeleteImageModalProps {
   imageUpload: ImageUpload,
   form: UseFormReturn<ImageUpload, any, undefined>,
   deleteImage: (id: string) => void
}

const DeleteImageModal = ({ imageUpload, form, deleteImage }: DeleteImageModalProps) => {
   const [open, setOpen] = useState(false);

   function handleDeleteImage() {
      deleteImage(imageUpload.id);
      setOpen(false);
   }

   return (
      <>
         <TooltipProvider>
            <Tooltip>
               <TooltipTrigger className={`cursor-auto`}>
                  <Button onClick={_ => setOpen(true)}
                          className={`rounded-full`} variant={`ghost`} size={`icon`}>
                     <Trash size={20} />
                  </Button>
               </TooltipTrigger>
               <TooltipContent side={`bottom`} className={`!text-xs rounded-lg bg-black text-white`}>
                  Delete
               </TooltipContent>
            </Tooltip>
         </TooltipProvider>
         <Dialog open={open} onOpenChange={_ => setOpen(false)}>
            <DialogTrigger>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                  <DialogTitle className={`text-left`}>
                     Are you sure you want to delete?
                  </DialogTitle>
                  <DialogDescription>
                  </DialogDescription>
               </DialogHeader>
               <div className="flex items-center justify-start gap-4 py-4 !h-fit">
                  <span className={`text-neutral-400 text-center text-md font-normal !my-8`}>
                     Deleting a file is permanent and will need to be reuploaded.
                  </span>
               </div>
               <DialogFooter className={`my-2 flex-0 w-full flex items-center !justify-between`}>
                  <Button
                     onClick={_ => setOpen(false)}
                     className={`rounded-full`}
                     variant={`ghost`} size={`default`}>Not
                     yet, take me back</Button>
                  <Button
                     // disabled={loading}
                     onClick={handleDeleteImage}
                     className={`rounded-full`} variant={`destructive`}
                     size={`lg`}>
                     Yes, delete
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};

export default DeleteImageModal;