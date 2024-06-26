"use client";
import { Button } from "@/components/ui/button";
import React, { Fragment } from "react";
import { useHover } from "@uidotdev/usehooks";
import { usePromise } from "@/hooks/usePromise";
import { handleFollowUser, handleUnfollowUser } from "@/app/users/[userId]/actions";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import { UserCheck, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { ModalType, useModals } from "@/providers/ModalsProvider";

export interface FollowUserButtonProps {
   userId: string;
   amIFollower: boolean;
}

const FollowUserButton = ({ userId, amIFollower }: FollowUserButtonProps) => {
   const [followButtonRef, hovering] = useHover();
   const {openModal} = useModals()
   const session = useSession();

   const { loading, action: followUser } = usePromise(async () => {
      if(!session.data) {
         openModal(ModalType.SIGN_IN)
         return
      }
      if (amIFollower) {
         await handleUnfollowUser(userId).then(console.log).catch(console.error);
      } else {
         await handleFollowUser(userId).then(console.log).catch(console.error);
      }
   });

   return (
      <Button
         ref={followButtonRef} disabled={loading} onClick={() => followUser()}
         className={cn(`gap-2 rounded-full !px-6 transition-colors duration-200`
            )}
         variant={`secondary`}>
         {loading ? (
            <LoadingSpinner text={`Loading ...`} />
         ) : amIFollower ? (
            <Fragment>
               {hovering ? <X size={16} /> : <UserCheck className={`text-green-700 stroke-[3px]`} size={16} />}
               {hovering ? `Unfollow` : `Following`}
            </Fragment>
         ) : (
            <Fragment>
               <UserPlus size={16} />
               Follow
            </Fragment>
         )}
      </Button>
   );
};

export default FollowUserButton;