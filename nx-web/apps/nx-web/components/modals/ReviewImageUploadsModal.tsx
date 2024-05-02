"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { handleUploadImages, ImageUpload } from "./actions";
import { ModalType, useModals } from "../../providers/ModalsProvider";
import { usePromise } from "../../hooks/usePromise";
import {
  Alert, AlertDescription, Button, buttonVariants, cn,
  Dialog,
  DialogContent, DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  objectToFormData, ScrollArea,
  TOASTS,
} from "@nx-web/shared";
import { LoadingSpinner } from "./SocialLogins";

export interface ReviewImageUploadsModalProps {
   imageUploads: ImageUpload[];
}

const ReviewImageUploadsModal = ({ imageUploads }: ReviewImageUploadsModalProps) => {
   const { modal, toggleModal, closeModal } = useModals();
   const imagePreviews = useMemo(() => {
      return new Map(imageUploads?.map(u => [u.id, u.imagePreview]));
   }, [imageUploads]);
   const { loading, action: handleUploadAction } = usePromise<any>((formData: FormData) =>
      handleUploadImages(formData));

   const inputFiles = useMemo(() => {
      return new Map(imageUploads?.map(u => [u.id, u.inputFile]));
   }, [imageUploads]);

   if (modal !== ModalType.REVIEW_UPLOAD_IMAGES) return null;

   async function handleSubmitUpload() {
      const data = imageUploads.map(u => {
         const { imagePreview, ...rest } = u;
         return rest;
      });

      let formData = new FormData();
      formData = objectToFormData(data, formData, `imageUploads`);

      await handleUploadAction(formData).then(res => {
         if (res.success) {
            const { message, ...rest } = data.length > 1 ? TOASTS.MANY_UPLOAD_SUCCESS : TOASTS.UPLOAD_SUCCESS;
            toast(message, { ...rest, icon: <Check size={16} /> });

            closeModal(ModalType.REVIEW_UPLOAD_IMAGES);
         }
      });
   }

   return (
      <Dialog open onOpenChange={_ => toggleModal(ModalType.REVIEW_UPLOAD_IMAGES)}>
         <DialogTrigger>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px] !min-h-fit flex flex-col">
            <DialogHeader className="!flex-0">
               <DialogTitle className={`text-left text-lg tracking-wide`}>Confirm your submission</DialogTitle>
               <DialogDescription className={`text-sm`}>
                  Take a moment to review your files before submitting for review
               </DialogDescription>
            </DialogHeader>
            <div className={`mt-4 flex-1 rounded-md border-[1px] dark:border-neutral-700 dark:bg-neutral-800`}>
               <div className={`p-2 px-4 flex items-baseline border-b-[1px] dark:border-neutral-700`}>
                  <span className={`dark:text-white !text-sm`}>
                     Your submission
                  </span>
                  <span className={`ml-4 text-neutral-500 text-xs`}>
                     {inputFiles.size} {inputFiles.size === 1 ? `file` : `files`}
                  </span>
               </div>
               <ScrollArea className={`p-4 px-6 !flex items-start gap-2 !max-h-[100px]`}>
                  <div className={`flex items-start gap-4`}>
                     {[...imagePreviews.entries()].map(([id, preview], i) => (
                        <Image
                           className={`rounded-md shadow-sm`}
                           height={100}
                           width={100}
                           alt={id} src={preview} key={id} />
                     ))}
                  </div>
               </ScrollArea>
            </div>
            <div>
               <Alert className={`text-base px-4 !py-2 flex !items-center gap-4`}>
                  <div className={`h-full flex items-center justify-center`}>
                     <Check className={``} size={18} />
                  </div>
                  <AlertDescription className={`mt-1 !leading-tight !text-sm`}>
                     By submitting, I acknowledge this upload adheres to the
                     <Link
                        href="/service/privacy"
                        className={cn(`underline-offset-4 !text-black dark:text-white !font-semibold !h-auto`, buttonVariants({ variant: `link` }), `!m-0 !py-0 !px-0 !text-sm`)}
                     >Content License
                     </Link>
                  </AlertDescription>
               </Alert>
            </div>
            <DialogFooter className={`my-0 flex-0 w-full flex items-center !justify-between`}>
               <Button
                  onClick={_ => closeModal(ModalType.REVIEW_UPLOAD_IMAGES)} variant={`ghost`} size={`default`}>Not
                  yet, take me back</Button>
               <Button
                  disabled={loading}
                  onClick={handleSubmitUpload} className={`rounded-full !px-6`} variant={`default`}
                  size={`default`}>
                  {loading ? (
                        <LoadingSpinner text={`Submitting ...`} />
                     ) :
                     `Submit(${inputFiles.size})`
                  }

               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ReviewImageUploadsModal;
