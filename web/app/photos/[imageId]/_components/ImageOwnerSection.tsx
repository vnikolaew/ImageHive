"use client";
import { User } from "@prisma/client";
import React, { useMemo } from "react";
import Image from "next/image";
import DefaultAvatar from "@/public/default-avatar.png";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { getFileName } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import FollowUserButton from "@/app/users/_components/FollowUserButton";

export interface ImageOwnerSectionProps {
   owner: User & { _count: { followedBy: number, following: number } },
   haveIFollowed?: boolean
}

function isAbsoluteUrl(url: string) {
   return /^https?:\/\//i.test(url);
}

const ImageOwnerSection = ({ owner, haveIFollowed }: ImageOwnerSectionProps) => {
   const session = useSession();
   const isMe = useMemo(() => session?.data?.user?.id === owner.id, [owner.id, session?.data?.user?.id]);

   return (
      <div className={`w-full p-4 flex items-center justify-between`}>
         <div className={`flex items-center gap-4`}>
            <Link href={`/users/${owner.id}`}>
               <Image height={36} width={36}
                      className={`rounded-full cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                      src={isAbsoluteUrl(owner.image!) ? owner.image! : owner.image ? `/profile-pictures/${getFileName(owner.image!)}` : DefaultAvatar}
                      alt={owner.name ?? ``} />
            </Link>
            <div className={`flex flex-col justify-center gap-0`}>
               <span className={`font-semibold dark:text-neutral-300`}>{owner.name}</span>
               <span
                  className={`font-normal text-neutral-500 text-sm`}>{owner._count.following} {`follower${owner._count.following === 1 ? `` : `s`}`}</span>
            </div>
         </div>
         <div>
            {!isMe &&
               <FollowUserButton userId={owner.id} amIFollower={haveIFollowed ?? false} />
            }
         </div>
      </div>
   );
};

export default ImageOwnerSection;