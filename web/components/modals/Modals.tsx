"use client";
import React, { Fragment } from "react";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import SignInModal from "./SignInModal";
import {
   AddImageToCollectionModalWrapper,
} from "@/components/modals/AddImageToCollectionModal";
import CreateNewCollectionModal from "@/components/modals/CreateNewCollectionModal";
import ShareProfileModal from "@/components/modals/ShareProfileModal";
import ChangeProfilePictureModal from "@/components/modals/ChangeProfilePictureModal";
import RemoveImageFromCollectionModal from "@/components/modals/RemoveImageFromCollectionModal";
import EditCollectionModal, { EditCollectionModalWrapper } from "@/components/modals/EditCollectionModal";

const Modals = () => {
   return (
      <Fragment>
         <SignInModal />
         <ForgotPasswordModal />
         <AddImageToCollectionModalWrapper />
         <RemoveImageFromCollectionModal />
         <EditCollectionModalWrapper />

         <CreateNewCollectionModal />
         <ShareProfileModal />
         <ChangeProfilePictureModal />
      </Fragment>
   );
};

export default Modals;