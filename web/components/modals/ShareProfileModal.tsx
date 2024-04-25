"use client";
import React, { useState } from "react";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import {
   Dialog, DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   FacebookIcon,
   FacebookShareButton,
   LinkedinIcon,
   LinkedinShareButton,
   PinterestIcon,
   PinterestShareButton,
   RedditIcon,
   RedditShareButton,
   TumblrIcon,
   TumblrShareButton,
   TwitterIcon,
   TwitterShareButton, VKIcon, VKShareButton, WeiboIcon, WeiboShareButton,
} from "react-share";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ShareProfileModalProps {
}

const ShareButtons = ({url}: { url : string}) => (
   <div className="mt-4 w-3/5 mx-auto flex-wrap flex-0 flex items-center justify-center gap-3">
      <FacebookShareButton
         openShareDialogOnClick
         formTarget={`_blank`}
         url={url}
         hashtag="#muo"
      >
         <FacebookIcon
            className={`p-2 !h-fit !w-fit bg-neutral-100 rounded-full hover:opacity-80`}
            size={32}
            round />
      </FacebookShareButton>
      <TwitterShareButton
         openShareDialogOnClick
         formTarget={`_blank`}
         url={url}
         hashtag="#muo"
      >
         <TwitterIcon
            className={`p-2 !h-fit !w-fit bg-neutral-100 rounded-full hover:opacity-80`}
            size={32}
            round />
      </TwitterShareButton>
      <LinkedinShareButton
         openShareDialogOnClick
         formTarget={`_blank`}
         url={url}
         hashtag="#muo"
      >
         <LinkedinIcon
            className={`p-2 !h-fit !w-fit bg-neutral-100 rounded-full hover:opacity-80`}
            size={32}
            round />
      </LinkedinShareButton>

      <TumblrShareButton
         openShareDialogOnClick
         formTarget={`_blank`}
         url={url}
         hashtag="#muo"
      >
         <TumblrIcon
            className={`p-2 !h-fit !w-fit bg-neutral-100 rounded-full hover:opacity-80`}
            size={32}
            round />
      </TumblrShareButton>
      <PinterestShareButton
         media={``}
         openShareDialogOnClick
         formTarget={`_blank`}
         url={url}
         hashtag="#muo"
      >
         <PinterestIcon
            className={`p-2 !h-fit !w-fit bg-neutral-100 rounded-full hover:opacity-80`}
            size={32}
            round />
      </PinterestShareButton>
      <RedditShareButton
         openShareDialogOnClick
         formTarget={`_blank`}
         url={url}
         hashtag="#muo"
      >
         <RedditIcon
            className={`p-2 !h-fit !w-fit bg-neutral-100 rounded-full hover:opacity-80`}
            size={32}
            round />
      </RedditShareButton>
      <VKShareButton
         openShareDialogOnClick
         formTarget={`_blank`}
         url={url}
         hashtag="#muo"
      >
         <VKIcon
            className={`p-2 !h-fit !w-fit bg-neutral-100 rounded-full hover:opacity-80`}
            size={32}
            round />
      </VKShareButton>
      <WeiboShareButton
         openShareDialogOnClick
         formTarget={`_blank`}
         hashtag="#muo"
         url={url}
      >
         <WeiboIcon
            className={`p-2 !h-fit !w-fit bg-neutral-100 rounded-full hover:opacity-80`}
            size={32}
            round />
      </WeiboShareButton>
   </div>
);

const ShareProfileModal = ({}: ShareProfileModalProps) => {
   const { modal, toggleModal, closeModal } = useModals();
   const [buttonText, setButtonText] = useState(`Copy`);
   if (modal !== ModalType.SHARE_PROFILE) return null;

   return (
      <Dialog
         onOpenChange={_ => toggleModal(ModalType.CREATE_NEW_COLLECTION)}
         open>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[700px] w-[50vw] !p-8 !pb-2 min-h-[60vh] !h-fit flex flex-col items-start">
            <DialogHeader className="">
               <DialogTitle className={`text-left text-2xl`}>Share</DialogTitle>
            </DialogHeader>
            <ShareButtons url={window.location.href} />
            <div className={`w-full mx-auto mt-4`}>
               <div className={`relative w-2/3 mx-auto`}>
                  <Input className={`w-full`} value={window.location.href} />
                  <Button
                     onClick={_ => {
                        if (`navigator` in window) {
                           window.navigator
                              .clipboard
                              .writeText(window.location.href)
                              .then(_ => {
                                 setButtonText(`Copied`);
                                 setTimeout(_ => setButtonText(`Copy`), 2000);
                              });
                        }
                     }}
                     variant={`secondary`}
                     className={`absolute right-2 top-1.5 !h-2/3 my-auto`}>{buttonText}</Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default ShareProfileModal;