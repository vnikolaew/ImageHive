"use client";
import React, { useRef } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/dialog";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Check, Cookie, Image, Upload } from "lucide-react";
import { default as NextImage } from "next/image";
import { useSingleFileImagePreview } from "@web/hooks/useFileImagePreviews";
import { usePromise } from "@web/hooks/usePromise";
import { editUserCoverImage } from "@web/app/users/[userId]/actions";
import { toast } from "sonner";
import { LoadingSpinner } from "@web/components/modals/SocialLogins";
import { TOASTS } from "@nx-web/shared";

export interface EditCoverImageModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
}

const EditCoverImageModal = ({ open, onOpenChange }: EditCoverImageModalProps) => {
   const inputRef = useRef<HTMLInputElement>(null);
   const { addImage, removeImage, imagePreview, inputFile } = useSingleFileImagePreview();
   const { action: editCoverImageAction, loading } = usePromise(async () => {
      const formData = new FormData();
      formData.append("file", inputFile);

      const res = await editUserCoverImage(formData);
      if (res.success) {

         const { message, ...rest } = TOASTS.CHANGE_PROFILE_COVER_IMAGE_SUCCESS;
         toast(message, { ...rest, icon: <Check className={``} size={16} /> });

         removeImage();
         onOpenChange(false);
      } else toast(`error`);
   });

   return (
      <Dialog
         onOpenChange={onOpenChange}
         open={open}>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[450px] !p-8 !h-fit flex flex-col items-start">
            <DialogHeader className="">
               <DialogTitle className={`text-left text-2xl`}>Cover image</DialogTitle>
            </DialogHeader>
            <div className={`flex flex-col w-full gap-4`}>
               {imagePreview ? (
                  <>
                     <NextImage
                        className={`!w-full rounded-md shadow-md`}
                        height={100} width={200} src={imagePreview}
                        alt={`sd`} />
                     <Button
                        className={`w-1/2 rounded-full mx-auto`}
                        onClick={_ => inputRef?.current.click()}
                        variant={`outline`}>
                        Choose another one
                     </Button>
                  </>
               ) : (
                  <div className={`w-full p-4 rounded-lg`}>
                     <div onDragOver={e => {
                        e.preventDefault();
                     }} onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        addImage(file);
                     }}
                          className={`flex flex-col flex-wrap items-center justify-center mt-12 h-[200px] border-dashed border-[2px] border-slate-300/70 dark:bg-slate-600/60 bg-slate-300/60 rounded-xl text-black dark:text-white shadow-md`}>
                        <div className={`my-4`}>
                           <Image className={`text-green-600`} size={18} />
                        </div>
                        <h2 className={`text-base font-bold`}>
                           Upload a landscape image
                        </h2>
                        <div className={`text-sm mt-2 mx-8 text-center text-neutral-500 !max-w-3/4 flex-wrap`}>
                           To choose a cover you must have a landscape image
                        </div>
                        <Button
                           onClick={_ => inputRef?.current?.click()}
                           className={`rounded-full !px-6 gap-2 mt-4 shadow-md`}
                           variant={`outline`}>
                           <Upload size={16} />
                           Upload
                        </Button>
                     </div>
                  </div>
               )}
               <form>
                  <Input accept={`image/*`} onChange={({ target: { files } }) => {
                     addImage(files![0]);
                  }} className={`hidden`} ref={inputRef} type={`file`} hidden />
               </form>
               <div className={`text-sm font-semibold`}>Or choose a gradient</div>
            </div>
            <DialogFooter className={`!w-full my-4 flex items-center !justify-between`}>
               <Button
                  onClick={_ => {
                     onOpenChange(false);
                  }}
                  variant={"outline"}
                  className={`self-start shadow-sm !px-6 rounded-full`} type="submit">
                  Cancel
               </Button>
               <Button
                  disabled={loading}
                  onClick={async _ => {
                     await editCoverImageAction();
                  }}
                  variant={`default`}
                  className={`self-end !px-6 rounded-full shadow-sm`} type="submit">
                  {loading ? (
                     <LoadingSpinner text={`Saving cover ...`} />
                  ) : `Apply`}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
      ;
};

export default EditCoverImageModal;
