"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { useHover } from "@uidotdev/usehooks";
import { usePromise } from "@/hooks/usePromise";
import { handleFollowUser, handleUnfollowUser } from "@/app/users/[userId]/actions";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import { UserCheck, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FollowUserButtonProps {
   userId: string;
   isMe: boolean;
   amIFollower: boolean
}

const FollowUserButton = ({ isMe, userId, amIFollower }: FollowUserButtonProps) => {
   const [followButtonRef, hovering] = useHover();

   const { loading, action: followUser } = usePromise(async () => {
      if (amIFollower) {
         await handleUnfollowUser(userId).then(console.log).catch(console.error);
      } else {
         await handleFollowUser(userId).then(console.log).catch(console.error);
      }
   });

   return (
      <Button
         ref={followButtonRef} disabled={loading} onClick={() => followUser()}
         className={cn(`gap-2 rounded-full !px-6 transition-colors duration-200`,
            ``)}
         variant={`secondary`}>
         {loading ? (
            <LoadingSpinner text={`Loading ...`} />
         ) : amIFollower ? (
            <>
               {hovering ? <X size={16} /> : <UserCheck size={16} />}

               {hovering ? `Unfollow` : `Following`}
            </>
         ) : (
            <>
               <UserPlus size={16} />
               Follow
            </>
         )}
      </Button>
   );
};

export default FollowUserButton;