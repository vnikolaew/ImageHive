"use client";
import React from "react";
import { User } from "@prisma/client";
import { Download, FileImage, Heart } from "lucide-react";

export interface FollowingCardProps {
   following: User & { _count: { images: number; imageLikes: number; imageDownloads: number } };
}

const FollowingCard = ({ following }: FollowingCardProps) => {
   return (
      <div
         className={`cursor-pointer group relative !z-10 w-[250px] h-[250px] group rounded-lg hover:brightness-90 transition-all duration-200 overflow-hidden`}
         style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
            backgroundImage: `url('${following.profilePictureImageSrc!}')`,
            backgroundPosition: `center center`,
            backgroundSize: `cover`,
            // opacity: `50%`
         }}
      >
         <h2 className={`absolute text-lg text-white bottom-3 left-4`}>{following.name}</h2>
         <div className={`absolute opacity-0 group-hover:opacity-100 group-hover:-translate-y-0 -translate-y-[120%] left-4 top-3 text-white flex items-start flex-col transition-all duration-200`}>
            <span className={`text-sm`}>
               <FileImage size={16}/>
               {following._count.images}
            </span>
            <span className={`text-sm flex items-center gap-1`}>
               <Download  size={16}/>
               {following._count.imageDownloads}
            </span>
            <span className={`text-sm flex items-center gap-1`}>
               <Heart size={16}/>
               {following._count.imageLikes}
            </span>
         </div>
      </div>
   );
};

export default FollowingCard;