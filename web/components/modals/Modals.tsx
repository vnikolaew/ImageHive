"use client";
import React, { Fragment } from "react";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import SignInModal from "./SignInModal";

const Modals = () => {
   return (
      <Fragment>
         <SignInModal />
         <ForgotPasswordModal />
      </Fragment>
   );
};

export default Modals;