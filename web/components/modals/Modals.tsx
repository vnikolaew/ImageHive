"use client";
import React from "react";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import SignInModal from "./SignInModal";

const Modals = () => {
   return (
      <>
         <SignInModal />
         <ForgotPasswordModal />
      </>
   );
};

export default Modals;