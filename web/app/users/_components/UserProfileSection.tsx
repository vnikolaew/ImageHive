"use client";
import React, { Fragment } from "react";
import Image from "next/image";
import DefaultAvatar from "@/public/default-avatar.png";
import moment from "moment/moment";
import { Account, Image as IImage, Profile, User } from "@prisma/client";
import RightSection from "@/app/users/_components/RightSection";
import FollowUserButton from "@/app/users/_components/FollowUserButton";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { ModalType, useModals } from "@/providers/ModalsProvider";

export interface UserProfileSectionProps {
   user: User & {
      images: (IImage & { _count: { likes: number } })[];
      accounts: Account[]
      _count: { followedBy: number, imageDownloads: number, imageLikes: number, following: number }
      profile: Profile;
   },
   amIFollower: boolean;
   isMe: boolean;
};

const UserProfileSection = ({ user, amIFollower, isMe }: UserProfileSectionProps) => {
   const { openModal } = useModals();

   return (
      <Fragment>
         <div className={`absolute group -top-[60px] text-white !z-10`}>
            <div className={`relative hidden group-hover:block w-full h-full`}>
               {isMe && (
                  <div className={`absolute text-black -top-2 -right-2 !z-30`}>
                     <Button
                        onClick={_ => openModal(ModalType.CHANGE_PROFILE_PICTURE)} variant={`ghost`}
                        className={`rounded-full !h-fit bg-white !p-3`}><Pencil
                        className={`fill-black`} size={18} /></Button>
                  </div>
               )}
            </div>
            <Image
               height={120}
               width={120}
               className={`rounded-full peer bg-white p-1 2xl:p-1 border-white border-[1px] xl:border-[1px] !w-36 !h-36`}
               src={user.profilePictureImageSrc ?? DefaultAvatar}
               alt={user.name!} />
         </div>
         <div className={`mt-[90px] w-full flex items-center justify-between`}>
            <div className={`flex items-start gap-8`}>
               <h2 className={`text-3xl font-bold`}>{user.name}</h2>
               {!isMe &&
                  (
                     <FollowUserButton userId={user.id} amIFollower={amIFollower} />
                  )
               }
            </div>
            <RightSection user={user} isMe={isMe} />
         </div>

         <div className={`flex items-center mt-4 gap-4`}>
            {user.profile.about}
         </div>
         <div className={`flex items-center mt-4 gap-4`}>
            <div>
               <b>{user._count.following}</b> <span className={`text-neutral-500`}>Followers</span>
            </div>
            <div>
               <b>{user._count.followedBy}</b> <span className={`text-neutral-500`}>Following</span>
            </div>
         </div>
         <div className={`flex text-neutral-500 items-center mt-4 gap-2`}>
            <div>
               {user.name}
            </div>
            &bull;
            {!!user.profile.country?.length && (
               <Fragment>
                  <div>
                     {user.profile.country}
                  </div>
                  &bull;
               </Fragment>
            )}
            <div className={`text-neutral-500 text-sm`}>
               Joined {moment(user.createdAt).format(`MMMM DD, YYYY`)}
            </div>
         </div>
         <div className={`flex items-center mt-2 gap-8`}>
            <div className={`flex flex-col items-start gap-0`}>
               <span>{user.images.reduce((a, b) => b._count.likes + a, 0)}</span>
               <span className={`text-xs text-neutral-500`}>Likes</span>
            </div>
            <div className={`flex flex-col items-start gap-0`}>
               <span>{user._count.imageDownloads}</span>
               <span className={`text-xs text-neutral-500`}>Downloads</span>
            </div>
         </div>
      </Fragment>
   );
};

export default UserProfileSection;