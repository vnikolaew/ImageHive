"use client";
import { MessageCircle } from "lucide-react";
import React from "react";
import { ModalType, useModals } from "../../../../providers/ModalsProvider";
import { APP_NAME } from "@nx-web/shared";
import { Button } from "../../../../components/ui/button";

export interface CommentsSectionSignInProps {
}

const CommentsSectionSignIn = ({}: CommentsSectionSignInProps) => {
   const { openModal } = useModals();
   return (
      <div
         className={`w-2/3 mx-auto p-8 items-center justify-center flex flex-col bg-neutral-100 mt-4 rounded-xl`}>
         <MessageCircle className={`fill-primary text-primary border-primary`} size={20} />
         <h2 className={`mt-2`}>The community are waiting to hear from you!
         </h2>
         <span className={`text-sm text-neutral-500 mt-2`}>Log in or Join {APP_NAME} to view comments</span>
         <div className={`flex items-center mt-8 w-full justify-between gap-8`}>
            <Button
               onClick={_ => openModal(ModalType.SIGN_IN)}
               className={`flex-1 shadow-md rounded-full`}
               variant={`outline`}>Log in</Button>
            <Button
               onClick={_ => openModal(ModalType.SIGN_UP)}
               className={`flex-1 rounded-full shadow-md`} variant={`default`}>Join {APP_NAME}</Button>
         </div>
      </div>
   );
};

export default CommentsSectionSignIn;
