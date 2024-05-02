"use client";
import React, { Fragment } from "react";
import SignInModal from "./SignInModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { AddImageToCollectionModalWrapper } from "./AddImageToCollectionModal";
import RemoveImageFromCollectionModal from "./RemoveImageFromCollectionModal";
import { EditCollectionModalWrapper } from "./EditCollectionModal";
import CreateNewCollectionModal from "./CreateNewCollectionModal";
import ShareProfileModal from "./ShareProfileModal";
import ChangeProfilePictureModal from "./ChangeProfilePictureModal";

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
