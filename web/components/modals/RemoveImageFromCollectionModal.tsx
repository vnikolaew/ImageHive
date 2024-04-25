"use client";
import React from "react";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import {
   Dialog, DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { useQsCollectionId, useQsImageId } from "@/hooks/useQsImageId";
import { Button } from "@/components/ui/button";
import { handleRemoveImageFromCollection } from "@/app/actions";

export interface RemoveImageFromCollectionModalProps {
}

const RemoveImageFromCollectionModal = ({}: RemoveImageFromCollectionModalProps) => {
   const { modal, toggleModal, closeModal } = useModals();
   const [imageId] = useQsImageId();
   const [collectionId] = useQsCollectionId();
   if (modal !== ModalType.REMOVE_IMAGE_FROM_COLLECTION) return null;

   return (
      <Dialog
         onOpenChange={_ => toggleModal(ModalType.REMOVE_IMAGE_FROM_COLLECTION)}
         open={modal === ModalType.REMOVE_IMAGE_FROM_COLLECTION}>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[450px] !p-8 !h-fit flex flex-col items-start">
            <DialogHeader className="">
               <DialogTitle className={`text-left text-2xl`}>Remove from collection</DialogTitle>
            </DialogHeader>
            <div className="mt-8 w-full text-base text-neutral-500 text-center">
               Are you sure you want to remove this item from your collection?
            </div>
            <div className={`w-full`}>
            </div>
            <DialogFooter className={`!w-full my-4 flex items-center !justify-between`}>
               <Button onClick={_ => closeModal(ModalType.REMOVE_IMAGE_FROM_COLLECTION)}
                       variant={"outline"}
                       className={`self-start shadow-sm !px-6 rounded-full`} type="submit">No, take me back</Button>
               <Button
                  onClick={_ => handleRemoveImageFromCollection(imageId!, collectionId!)}
                  variant={`destructive`}
                  className={`self-end !px-6 rounded-full shadow-sm`} type="submit">
                  Yes, Remove
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default RemoveImageFromCollectionModal;