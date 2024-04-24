"use client";
import React, { Fragment } from "react";
import Image from "next/image";
import DefaultAvatar from "@/public/default-avatar.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";
import moment from "moment/moment";
import { User, Image as IImage, Account } from "@prisma/client";
import { usePromise } from "@/hooks/usePromise";
import { handleFollowUser } from "@/app/users/[userId]/actions";
import { LoadingSpinner } from "@/components/modals/SocialLogins";

export interface UserProfileSectionProps {
   user: User & {
      images: IImage[];
      accounts: Account[]
      _count: { followedBy: number, imageDownloads: number, imageLikes: number, following: number }
   },
};

const UserProfileSection = ({ user }: UserProfileSectionProps) => {
   const { loading, action: followUser } = usePromise(async () => {
      await handleFollowUser(user.id!).then(console.log).catch(console.error);
   });


   return (
      <Fragment>
         <div className={`absolute -top-[60px] text-white z-30`}>
            <Image
               height={120} width={120} className={`rounded-full bg-white p-2 border-white border-[2px]`}
               src={user.image ?? DefaultAvatar}
               alt={user.name!} />
         </div>
         <div className={`mt-[80px] w-full flex items-center justify-between`}>
            <div className={`flex items-start gap-8`}>
               <h2 className={`text-3xl font-bold`}>{user.name}</h2>
               <Button disabled={loading} onClick={() => followUser()}
                       className={cn(`gap-2 rounded-full !px-6  transition-colors duration-200`,
                          `dark:hover:bg-neutral-600`)}
                       variant={`secondary`}>
                  {loading ? (
                     <LoadingSpinner text={`Loading ...`} />
                  ) : (
                     <>
                        <UserPlus size={16} />
                        Follow
                     </>
                  )}
               </Button>
            </div>
            <div>End section.</div>
         </div>
         <div className={`flex items-center mt-4 gap-4`}>
            <div>
               {user._count.followedBy} <span className={`text-neutral-500`}>Followers</span>
            </div>
            <div>
               {user._count.following} <span className={`text-neutral-500`}>Following</span>
            </div>
         </div>
         <div className={`flex text-neutral-500 items-center mt-4 gap-2`}>
            <div>
               {user.name}
            </div>
            &bull;
            <div>
               Age 20
            </div>
            &bull;
            <div>
               From
            </div>
            &bull;
            <div className={`text-neutral-500 text-sm`}>
               Joined {moment(user.createdAt).format(`MMMM DD, YYYY`)}
            </div>

         </div>
      </Fragment>
   );
};

export default UserProfileSection;