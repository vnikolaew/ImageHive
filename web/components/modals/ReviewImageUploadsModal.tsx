"use client";
import React, { useMemo } from "react";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";
import { cn, objectToFormData } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { handleUploadImages } from "@/components/modals/actions";
import { ImageUpload } from "@/app/upload/_store/imageUploadsStore";
import { TOASTS } from "@/lib/consts";
import { usePromise } from "@/hooks/usePromise";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import { toast } from "sonner";

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
            const { message, ...rest } = TOASTS.UPLOAD_SUCCESS;
            toast(message, { ...rest, icon: <Check size={16} /> });

            closeModal(ModalType.REVIEW_UPLOAD_IMAGES);
         }
      });
   }

   return (
      <Dialog open onOpenChange={_ => toggleModal(ModalType.REVIEW_UPLOAD_IMAGES)}>
         <DialogTrigger>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px] !h-[100vh] flex flex-col">
            <DialogHeader className="!flex-0">
               <DialogTitle className={`text-left text-lg tracking-wide`}>Confirm your submission</DialogTitle>
               <DialogDescription className={`text-sm`}>
                  Take a moment to review your files before submitting for review
                  {/*<Separator className={`w-5/6 mr-auto mt-2 bg-neutral-700 rounded-full`} />*/}
               </DialogDescription>
            </DialogHeader>
            <div className={`mt-12 flex-1 rounded-md border-[1px] border-neutral-700 bg-neutral-800`}>
               <div className={`p-4 px-6 flex items-center border-b-[1px] border-neutral-700`}>
                  <span>
                     Your submission
                  </span>
                  <span className={`ml-4 text-neutral-500 text-sm`}>
                     {inputFiles.size} {inputFiles.size === 1 ? `file` : `files`}
                  </span>
               </div>
               <ScrollArea className={`p-4 px-6 !flex items-start gap-2`}>
                  <div className={`flex items-start gap-2`}>
                     {[...imagePreviews.entries()].map(([id, preview], i) => (
                        <Image
                           className={`rounded-md`}
                           height={100}
                           width={100}
                           alt={id} src={preview} key={id} />
                     ))}
                  </div>
               </ScrollArea>
            </div>
            <div>
               <Alert className={`text-lg px-6 flex !items-center gap-2`}>
                  <div className={`h-full flex items-center justify-center`}>
                     <Check className={``} size={20} />
                  </div>
                  <AlertDescription className={`mt-1 leading-tight`}>
                     By submitting, I acknowledge this upload adheres to the
                     <Link
                        href="/service/privacy"
                        className={cn(`underline-offset-4 hover:text-primary !h-auto`, buttonVariants({ variant: `link` }), `!m-0 !py-0 !px-0`)}
                     >Content License
                     </Link>
                  </AlertDescription>
               </Alert>
            </div>
            <DialogFooter className={`my-2 flex-0 w-full flex items-center !justify-between`}>
               <Button
                  onClick={_ => closeModal(ModalType.REVIEW_UPLOAD_IMAGES)} variant={`ghost`} size={`default`}>Not
                  yet, take me back</Button>
               <Button
                  disabled={loading}
                  onClick={handleSubmitUpload} className={`rounded-full`} variant={`default`}
                  size={`lg`}>
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