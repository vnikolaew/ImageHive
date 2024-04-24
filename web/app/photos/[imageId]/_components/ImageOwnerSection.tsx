"use client";
import { User } from "@prisma/client";
import React, { useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DefaultAvatar from "@/public/default-avatar.png";
import { UserPlus } from "lucide-react";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { cn, getFileName } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";

export interface ImageOwnerSectionProps {
   owner: User & { _count: { followedBy: number } };
}

function isAbsoluteUrl(url: string) {
   return /^https?:\/\//i.test(url);
}

const ImageOwnerSection = ({ owner }: ImageOwnerSectionProps) => {
   const isDarkMode = useIsDarkMode();
   const session = useSession();
   const isMe = useMemo(() => session?.data?.user?.id === owner.id, [owner.id, session?.data?.user?.id]);

   return (
      <div className={`w-full p-4 flex items-center justify-between`}>
         <div className={`flex items-center gap-4`}>
            <Link href={isMe ? `/account/profile` : `/users/${owner.id}`}>
               <Image height={36} width={36}
                      className={`rounded-full cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                      src={isAbsoluteUrl(owner.image!) ? owner.image! : owner.image ? `/uploads/${getFileName(owner.image!)}` : DefaultAvatar}
                      alt={owner.name ?? ``} />
            </Link>
            <div className={`flex flex-col justify-center gap-0`}>
               <span className={`font-semibold dark:text-neutral-300`}>{owner.name}</span>
               <span className={`font-normal text-neutral-500 text-sm`}>{owner._count.followedBy} followers</span>
            </div>
         </div>
         <div>
            {!isMe && (
               <Button className={cn(`gap-2 rounded-full !px-6  transition-colors duration-200`,
                  isDarkMode && `hover:bg-neutral-600`)}
                       variant={`secondary`}>
                  <UserPlus size={16} />
                  Follow
               </Button>
            )}
         </div>
      </div>
   );
};

export default ImageOwnerSection;