"use client";
import React, {
   createContext,
   Dispatch, Fragment,
   PropsWithChildren,
   SetStateAction,
   useContext,
   useEffect,
   useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Modals from "@/components/modals/Modals";

export enum ModalType {
   SIGN_IN = 1,
   FORGOT_PASSWORD = 2
}

const ModalsContext = createContext<[Record<ModalType, boolean>, Dispatch<SetStateAction<Record<ModalType, boolean>>>]>(null!);

export const useModalsContext = () => useContext(ModalsContext);

export function useModals() {
   const [modals, setModals] = useModalsContext();

   const toggleModal = (modal: ModalType) => {
      if (modal in modals) setModals({ ...modals, [modal]: !modals[modal] });
      //@ts-ignore
      else setModals({ ...modals, [modal]: true });
   };

   const closeModal = (modal: ModalType) => {
      setModals({ ...modals, [modal]: false });
   };

   const openModal = (modal: ModalType) => {
      const newModals: Record<ModalType, boolean> = Object.entries(modals).reduce((acc, [key, value]) => ({
         ...acc,
         [key]: key == modal,
      }), {} as Record<ModalType, boolean>);

      setModals(newModals);
   };

   return { modals, toggleModal, closeModal, openModal };
}

export const ModalsListener = () => {
   const { openModal } = useModals();
   const searchParams = useSearchParams();

   useEffect(() => {
      const modal = searchParams.get("modal");

      if (modal && modal in ModalType) {
         openModal(modal as ModalType);
      }

   }, [searchParams]);

   return <Fragment />
};

export const ModalsProvider = ({ children }: PropsWithChildren) => {
   const [modals, setModals] = useState<Record<ModalType, boolean>>({
      [ModalType.SIGN_IN]: false,
      [ModalType.FORGOT_PASSWORD]: false,
   });

   return (
      <ModalsContext.Provider value={[modals, setModals]}>
         <ModalsListener/>
         <Modals />
         {children}
      </ModalsContext.Provider>
   );
};
