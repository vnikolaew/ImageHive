"use client";
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DefaultAvatar from "@/public/default-avatar.png";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { cn, getFileName, getSessionImageSrc, isAbsoluteUrl } from "@/lib/utils";
import path from "path";
import { Button } from "@/components/ui/button";
import { useSingleFileImagePreview } from "@/hooks/useFileImagePreviews";
import { Separator } from "@/components/ui/separator";
import { Check, Plus, Trash } from "lucide-react";
import { handleUpdateProfilePicture } from "@/components/modals/actions";
import { usePromise } from "@/hooks/usePromise";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import { TOASTS } from "@/lib/consts";
import { toast } from "sonner";

export interface ChangeProfilePictureModalProps {
}

const DEFAULT_USER_IMAGES = [
   `green.svg`,
   `orange.svg`,
   `purple.svg`,
   `teal.svg`,
   `yellow.svg`,
].map((i) => `https://pixabay.com/static/img/profile_images/${i}`);

function getImageSrc(image: string) {
   if (!image) return DefaultAvatar;
   return isAbsoluteUrl(image) ? image : path.join(`/uploads`, getFileName(image)!).replaceAll(`\\`, `/`);
}

const ChangeProfilePictureModal = ({}: ChangeProfilePictureModalProps) => {
   const session = useSession();
   const [selectedImagePattern, setSelectedImagePattern] = useState(``);

   const { modal, toggleModal, closeModal } = useModals();
   const { addImage, removeImage, imagePreview, inputFiles } = useSingleFileImagePreview();

   const { loading, action: handleUplodProfilePictureAction } = usePromise(async (data: FormData) => {
      await handleUpdateProfilePicture(data).then(res => {
         if (res.success) {
            session
               .update({ ...session, image: res.data!.image }).then(_ => {
               closeModal(ModalType.CHANGE_PROFILE_PICTURE);
               const { message, ...rest } = TOASTS.CHANGE_PROFILE_PICTURE_SUCCESS;
               toast(message, { ...rest, icon: <Check size={16} /> });
            });
         }
      })
         .catch(console.error);
   });

   const inputRef = useRef<HTMLInputElement>(null!);
   if (modal !== ModalType.CHANGE_PROFILE_PICTURE) return null;

   async function handleUpdateProfilePictureClient() {
      const formData = new FormData();
      if (!!inputFiles) {
         formData.append(`file`, inputFiles);
      } else if (!!selectedImagePattern?.length) {
         formData.append(`url`, selectedImagePattern);
      }
      await handleUplodProfilePictureAction(formData);

   }

   return (
      <Dialog
         onOpenChange={_ => toggleModal(ModalType.CREATE_NEW_COLLECTION)}
         open>
         <DialogTrigger></DialogTrigger>
         <DialogContent className="sm:max-w-[450px] !p-8 !pb-2 min-h-[60vh] !h-fit flex flex-col items-start">
            <DialogHeader className="">
               <DialogTitle className={`text-left text-2xl`}>Profile picture</DialogTitle>
            </DialogHeader>
            <div className="mt-8 w-full flex-1">
               <div className={`flex items-start gap-4`}>
                  <Image
                     className={`rounded-full shadow-sm flex-1 !w-32 !h-32`}
                     alt={getSessionImageSrc(session.data?.user?.name!)}
                     objectFit={`cover`}
                     objectPosition={`center center`}
                     height={100} width={100}
                     src={!!imagePreview?.length
                        ? imagePreview
                        : !!selectedImagePattern?.length
                           ? selectedImagePattern
                           : getSessionImageSrc(session.data?.user!.image!)} />
                  <div className={`flex flex-col items-start gap-2`}>
                     <h2>
                        Update your profile picture
                     </h2>
                     <input onChange={e => {
                        if (e.target.files?.[0]) {
                           addImage(e.target.files[0]);
                           setSelectedImagePattern(null!);
                        }
                     }} ref={inputRef} className={`hidden`} accept={`image/*`} type={"file"} />
                     <div className={`flex items-center gap-2`}>
                        <Button onClick={_ => inputRef.current?.click()}
                                className={`rounded-full border-neutral-300 border-[1px] my-4 hover:border-black`}
                                size={`lg`} variant={`ghost`}>
                           Browse files
                        </Button>
                        {!!inputFiles && (
                           <Button onClick={_ => removeImage()}
                                   className={`rounded-full gap-2  my-4 hover:border-black`}
                                   size={`sm`} variant={`ghost`}>
                              <Trash size={16} className="text-neutral-500 " />
                              Remove
                           </Button>
                        )}
                     </div>
                     <span className={`text-neutral-500 text-xs`}>
                        Supported files: PNG or JPG, smaller than 16MB
                     </span>
                  </div>
               </div>
            </div>
            <Separator className={`my-8 !mb-4`} />
            <div className={`flex items-start flex-col`}>
               <h2 className={`text-neutral-500 text-sm`}>Or choose a pattern</h2>
               <div className={`flex items-center gap-4 mt-4`}>
                  {DEFAULT_USER_IMAGES.map((image, i) => (
                     <div key={i} className={`relative`}>
                        <Image
                           onClick={_ => {
                              removeImage();
                              setSelectedImagePattern(image);
                           }}
                           height={60} width={60} className={`rounded-full cursor-pointer   `} key={i} src={image}
                           alt={image} />
                        <div className={`absolute -top-1 right-0`}>
                           <Button
                              onClick={_ => {
                                 removeImage();
                                 setSelectedImagePattern(image);
                              }}
                              className={cn(`!h-fit !p-1 rounded-full bg-neutral-300 border-white border-[1px] `,
                                 selectedImagePattern === image ? `bg-green-500 hover:bg-green-500 cursor-auto` : `hover:bg-neutral-300`)}>
                              {selectedImagePattern === image ? (
                                 <Check className={`fill-green-500 text-white`} size={10} />
                              ) : (
                                 <Plus className={`fill-black text-black`} size={10} />
                              )}
                           </Button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <DialogFooter className={`!w-full my-4 flex items-center !justify-between`}>
               <Button onClick={_ => closeModal(ModalType.CHANGE_PROFILE_PICTURE)} variant={"outline"}
                       className={`self-start shadow-sm !px-6 rounded-full`} type="submit">Cancel</Button>
               <Button
                  disabled={loading}
                  onClick={handleUpdateProfilePictureClient}
                  variant={`default`}
                  className={`self-end !px-6 rounded-full shadow-sm`} type="submit">
                  {loading ? (
                     <LoadingSpinner text={`Saving ...`} />
                  ) : (
                     `Apply`
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};

export default ChangeProfilePictureModal;