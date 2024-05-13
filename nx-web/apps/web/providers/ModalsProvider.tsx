"use client";
import React, {
   createContext,
   Dispatch,
   PropsWithChildren,
   SetStateAction,
} from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import Modals from "../components/modals/Modals";

export enum ModalType {
   SIGN_UP = 1,
   SIGN_IN = 2,
   FORGOT_PASSWORD = 3,
   REVIEW_UPLOAD_IMAGES = 4,
   ADD_IMAGE_TO_COLLECTION = 5,
   CREATE_NEW_COLLECTION = 6,
   SHARE_PROFILE = 7,
   CHANGE_PROFILE_PICTURE = 8,
   REMOVE_IMAGE_FROM_COLLECTION = 9,
   EDIT_COLLECTION = 10,
   REPORT_MEDIA = 11,
}

const ModalsContext = createContext<[ModalType | null, Dispatch<SetStateAction<ModalType | null>>]>(null!);

const useModalQueryState = () => useQueryState<ModalType>(`modal`,
   parseAsInteger.withOptions({
      history: `push`,
   }));

export function useModals() {
   const [modal, setModal] = useModalQueryState();

   const toggleModal = (m: ModalType) => {
      if (!!modal) setModal(null);
      else setModal(m);
   };

   const closeModal = (modal: ModalType) => {
      setModal(null);
   };

   const openModal = (modal: ModalType) => {
      setModal(modal);
   };

   return { modal, toggleModal, closeModal, openModal };
}


export const ModalsProvider = ({ children }: PropsWithChildren) => {
   const [modal, setModal] = useModalQueryState();

   return (
      <ModalsContext.Provider value={[modal, setModal]}>
         {children}
         <Modals />
      </ModalsContext.Provider>
   );
};
