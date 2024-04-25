"use client";
import React, { Fragment } from "react";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import SignInModal from "./SignInModal";
import {
   AddImageToCollectionModalWrapper,
} from "@/components/modals/AddImageToCollectionModal";
import CreateNewCollectionModal from "@/components/modals/CreateNewCollectionModal";
import ShareProfileModal from "@/components/modals/ShareProfileModal";

const Modals = () => {
   return (
      <Fragment>
         <SignInModal />
         <ForgotPasswordModal />
         <AddImageToCollectionModalWrapper />
         <CreateNewCollectionModal />
         <ShareProfileModal />
      </Fragment>
   );
};

export default Modals;