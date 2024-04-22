"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { deleteMedia } from "@/app/account/media/actions";
import { usePromise } from "@/hooks/usePromise";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import { APP_NAME, TOASTS } from "@/lib/consts";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface MediaSettingsFormProps {
   imageId: string,
   onCloseModal: (_: any) => void
}

const MediaSettingsForm = ({ imageId, onCloseModal }: MediaSettingsFormProps) => {
   const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
   const { loading, action: handleDeleteMediaAction } = usePromise(async (imageId: string) => {
      return await deleteMedia(imageId);
   });

   async function handleDeleteMedia() {
      await handleDeleteMediaAction(imageId).then(res => {
         if (res.success) {
            const { message, ...rest } = TOASTS.DELETE_IMAGE_SUCCESS;
            toast(message, { ...rest, icon: <Check size={16} /> });
            onCloseModal(null!);
         }
      }).catch(console.error);
   }

   return (
      <div className={`flex flex-col justify-between h-full`}>
         <div className="flex items-center justify-between w-full">
            <div className=" flex gap-2 flex-col">
               <p className="text-sm font-medium leading-none">
                  Delete this media
               </p>
               <p className="text-sm text-muted-foreground">
                  Remove this media from {APP_NAME}.
               </p>
            </div>
            <Button
               onClick={_ => setDeleteConfirmationModalOpen(true)} size={`sm`} className={`rounded-full !px-8 !py-1`}
               variant={`destructive`}>Delete</Button>
         </div>
         <div className={` items-center flex justify-between `}>
            <Button
               className={`rounded-full !px-8`}
               type={`button`}
               onClick={e => {
                  e.preventDefault();
                  onCloseModal(e);
               }} variant={`ghost`} size={`default`}>
               Close
            </Button>
         </div>
         <Dialog onOpenChange={setDeleteConfirmationModalOpen} open={deleteConfirmationModalOpen}>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="min-h-[30vh] !h-fit !w-[30vw] !max-w-[30vw]  rounded-xl">
               <DialogHeader className={`text-xl`}>
                  Are you sure you want to delete?
               </DialogHeader>
               <div className={`flex-1 mt-4`}>
                     <span className={` text-md font-normal text-neutral-500`}>
                        Deleting a file is permanent and will need to be reuploaded
                        </span>
               </div>
               <DialogFooter className={`mt-4 flex-0 w-full flex items-center !justify-between`}>
                  <Button
                     className={`rounded-full `}
                     onClick={_ => setDeleteConfirmationModalOpen(false)} variant={`ghost`} size={`default`}>
                     No, take me back
                  </Button>
                  <Button
                     disabled={loading}
                     onClick={handleDeleteMedia} className={`rounded-full !px-12`} variant={`destructive`}
                     size={`lg`}>
                     {loading ? <LoadingSpinner text={`Deleting ...`} /> : `Delete`}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default MediaSettingsForm;