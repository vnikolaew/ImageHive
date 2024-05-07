"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImageUpload } from "@web/components/modals/actions";
import { UseFormReturn } from "react-hook-form";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import ImagePreviewsSection from "./ImagePreviewsSection";
import UploadImageForm from "./UploadImageForm";
import DeleteImageModal from "./DeleteImageModal";
import ReviewImageUploadsModal from "../../../components/modals/ReviewImageUploadsModal";
import { ScrollArea } from "@components/scroll-area";
import { Button } from "@components/button";

export interface ImagesUploadSectionProps {
   imageUploads?: ImageUpload[],
   form: UseFormReturn<ImageUpload, any, undefined>,
   removeImage: (id: string) => void
}

const ImagesUploadSection = ({ imageUploads, form, removeImage }: ImagesUploadSectionProps) => {
   const [selectedImageId, setSelectedImageId] = useState(``);
   const scrollAreaRef = useRef<HTMLDivElement>(null!);
   const { openModal } = useModals();

   useEffect(() => {
      document.getElementById(`form-${selectedImageId}`)?.scrollIntoView({ behavior: "smooth" });
   }, [selectedImageId]);

   return (
      <div className={`flex flex-col gap-8 items-center`}>
         <div className={`flex gap-12 items-start my-8`}>
            <ImagePreviewsSection
               imageUploads={imageUploads!}
               selectedImageId={selectedImageId}
               setSelectedImageId={setSelectedImageId}
            />
            <ScrollArea ref={scrollAreaRef}>
               <div className={`flex flex-col gap-8 `}>
                  {!!imageUploads?.length && imageUploads.map((imageUpload, i) => (
                     <div className={`flex items-center gap-4`} key={imageUpload.id}>
                        <UploadImageForm
                           index={i}
                           form={form}
                           key={imageUpload.id}
                           inputFile={imageUpload.inputFile} imagePreview={imageUpload.imagePreview}
                           id={imageUpload.id}
                        />
                        <DeleteImageModal deleteImage={removeImage} imageUpload={imageUpload} />
                     </div>
                  ))}
               </div>
            </ScrollArea>
         </div>
         <div className={`w-full flex justify-end`}>
            <Button
               onClick={_ => {
                  openModal(ModalType.REVIEW_UPLOAD_IMAGES);
               }}
               size={`lg`}
               className={`rounded-full !px-12 text-md`}
               variant={`default`}>
               Review ({imageUploads?.length})
            </Button>
            <ReviewImageUploadsModal imageUploads={imageUploads!} />
         </div>
      </div>
   );
};

export default ImagesUploadSection;
