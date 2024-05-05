"use client";
import { Pencil } from "lucide-react";
import React from "react";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import { useQsCollectionId } from "@web/hooks/useQueryString";
import { Button } from "@components/button";

interface EditCollectionButtonProps {
   collectionId: string;
}

const EditCollectionButton = ({ collectionId }: EditCollectionButtonProps) => {
   const { openModal } = useModals();
   const [, setCollectionId] = useQsCollectionId();

   return (
      <Button
         onClick={_ => {
            setCollectionId(collectionId).then(_ => {
               openModal(ModalType.EDIT_COLLECTION);
            });
         }} variant={`secondary`}
         className={`rounded-full gap-2 `}>
         <Pencil className={`fill-black shadow-sm`} size={12} />
         Edit collection
      </Button>
   );
};

export default EditCollectionButton;
