"use client";
import React, {
   createContext,
   Dispatch,
   PropsWithChildren,
   SetStateAction,
} from "react";
import Modals from "@/components/modals/Modals";
import { parseAsInteger, useQueryState } from "nuqs";

export enum ModalType {
   SIGN_UP = 1,
   SIGN_IN = 2,
   FORGOT_PASSWORD = 3,
   REVIEW_UPLOAD_IMAGES = 4
}

const ModalsContext = createContext<[ModalType | null, Dispatch<SetStateAction<ModalType | null>>]>(null!);

const useModalQueryState = () => useQueryState<ModalType>(`modal`,
   parseAsInteger.withOptions({
      history: `replace`,
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
