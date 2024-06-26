"use client";
import React from "react";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import {
  Dialog,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
} from "@components/dialog";
import { Separator } from "@components/separator";
import { ScrollArea } from "@components/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/tabs";

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
            <Separator className={`w-5/6 mx-auto mt-2 dark:bg-neutral-700 rounded-full`} />
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
