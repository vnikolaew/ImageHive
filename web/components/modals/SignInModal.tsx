"use client";
import React from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpForm from "@/components/modals/SignUpForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import SignInForm from "@/components/modals/SignInForm";
import { Separator } from "@/components/ui/separator";

enum TABS {
   SIGN_UP = `SIGN_UP`,
   SIGN_IN = "SIGN_IN"
}

const SignInModal = () => {
   const { modal, toggleModal, openModal } = useModals();
   if (modal !== ModalType.SIGN_IN && modal !== ModalType.SIGN_UP) return null;

   return (
      <Dialog open onOpenChange={_ => toggleModal(ModalType.SIGN_IN)}>
         <DialogTrigger>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle className={`text-center`}>Sign up to your account</DialogTitle>
               <DialogDescription>
                  <Separator className={`w-5/6 mx-auto mt-2 bg-neutral-700 rounded-full`} />
               </DialogDescription>
            </DialogHeader>
            <ScrollArea className="grid gap-4 py-4 h-[65vh]">
               <Tabs
                  onValueChange={value => openModal(
                     value === TABS.SIGN_UP ? ModalType.SIGN_UP : ModalType.SIGN_IN,
                  )}
                  value={modal === ModalType.SIGN_IN ? TABS.SIGN_IN : TABS.SIGN_UP}
                  defaultValue="account"
                  className="px-4">
                  <TabsList className="w-full">
                     <TabsTrigger className={`w-1/2`} value={TABS.SIGN_UP}>Sign up</TabsTrigger>
                     <TabsTrigger className={`w-1/2`} value={TABS.SIGN_IN}>Sign in</TabsTrigger>
                  </TabsList>
                  <TabsContent className={`mt-4 w-3/4 mx-auto`} value={TABS.SIGN_UP}>
                     <SignUpForm />
                  </TabsContent>
                  <TabsContent className={`mt-4 w-3/4 mx-auto`} value={TABS.SIGN_IN}>
                     <SignInForm />
                  </TabsContent>
               </Tabs>
            </ScrollArea>
            <DialogFooter className={`my-2`}>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default SignInModal;
;