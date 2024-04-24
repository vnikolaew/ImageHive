"use client";
import { User } from "@prisma/client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";
import { cn } from "@/lib/utils";

export interface ImageOwnerSectionProps {
   owner: User & { _count: { followedBy: number } };
}

const ImageOwnerSection = ({ owner }: ImageOwnerSectionProps) => {
   const isDarkMode = useIsDarkMode();
   return (
      <div className={`w-full p-4 flex items-center justify-between`}>
         <div className={`flex items-center gap-4`}>
            <Image height={36} width={36}
                   className={`rounded-full cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                   src={owner.image!} alt={owner.name ?? ``} />
            <div className={`flex flex-col justify-center gap-0`}>
               <span className={`font-semibold dark:text-neutral-300`}>{owner.name}</span>
               <span className={`font-normal text-neutral-500 text-sm`}>{owner._count.followedBy} followers</span>
            </div>
         </div>
         <div>
            <Button className={cn(`gap-2 rounded-full !px-6  transition-colors duration-200`,
               isDarkMode && `hover:bg-neutral-600`)}
                    variant={`secondary`}>
               <UserPlus size={16} />
               Follow
            </Button>
         </div>
      </div>
   );
};

export default ImageOwnerSection;