"use client";
import { Button } from "@components/button";
import React, { Fragment, useState } from "react";
import { Camera } from "lucide-react";
import EditCoverImageModal from "@web/app/users/[userId]/_components/EditCoverImageModal";
import { getFileName } from "@utils";


interface UserProfileCoverSectionProps {
   coverImage?: string,
   isMe: boolean
}

const UserProfileCoverSection = ({ coverImage, isMe }: UserProfileCoverSectionProps) => {
   const [editCoverModalOpen, setEditCoverModalOpen] = useState(false);

   return (
      <Fragment>
         <div
            style={{
               background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
               backgroundImage: `url('${!!coverImage?.length ? `/covers/${getFileName(coverImage)}` : `/dark-banner.png`}')`,
               backgroundPosition: `center center`,
               backgroundSize: `cover`,
            }}
            className="w-full h-[300px] !brightness-75 group !z-10 flex items-center relative justify-center flex-col"
         >
            {isMe && (
               <div className="absolute hidden group-hover:flex bottom-12 right-12"><Button
                  onClick={_ => setEditCoverModalOpen(true)}
                  className={`flex items-center !px-8 gap-2 rounded-full !z-30 text-white text-sm hover:!bg-neutral-500 hover:text-white hover:!bg-opacity-30`}
                  variant={`ghost`}>
                  <Camera size={18} />
                  <span>Edit cover</span>
               </Button>
               </div>

            )}
         </div>
         <EditCoverImageModal open={editCoverModalOpen} onOpenChange={setEditCoverModalOpen} />
      </Fragment>
   );
};

export default UserProfileCoverSection;
