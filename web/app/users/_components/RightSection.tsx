"use client";
import React, { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
   Earth,
   Ellipsis,
   Facebook,
   Flag,
   Instagram, LucideIcon,
   MessagesSquare,
   Pencil,
   Share2,
   Twitter,
   Youtube,
} from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ModalType, useModals } from "@/providers/ModalsProvider";
import { Account, Image, Profile, User } from "@prisma/client";

interface RightSectionProps {
   isMe: boolean,
   user: User & {
      images: (Image & { _count: { likes: number } })[];
      accounts: Account[];
      _count: { followedBy: number; imageDownloads: number; imageLikes: number; following: number };
      profile: Profile
   }
}

const SOCIAL_ICONS: Record<string, LucideIcon> = {
   "facebook": Facebook,
   "instagram": Instagram,
   "soundCloud": null!,
   "twitter": Twitter,
   "youtube": Youtube,
};

const RightSection = ({ isMe, user }: RightSectionProps) => {
   const { modal, openModal } = useModals();
   console.log(Object.keys(user.profile?.onlineProfiles));

   return (
      <div className={`flex items-center gap-2`}>
         <TooltipProvider>
            {Object.entries(user.profile?.onlineProfiles ?? {})
               .filter(x => !!x[1]?.length)
               .map(([key, value]) => [key, value, SOCIAL_ICONS[key]])
               .map(([key, value, Icon]) => (
                  <Tooltip key={key}>
                     <TooltipTrigger>
                        <Button
                           asChild
                           className={`rounded-full border-[0px] border-neutral-300 !p-3 !h-fit`} variant={`ghost`}
                        >
                           <Link target={`_blank`} href={value}>
                              <Icon size={20} />
                           </Link>
                        </Button>
                     </TooltipTrigger>
                     <TooltipContent
                        side={`bottom`}
                        className={`dark:bg-white dark:text-black bg-black`}>{`${key[0].toUpperCase()}${key.slice(1)}`}</TooltipContent>
                  </Tooltip>
               ))}
            <Tooltip>
               <TooltipTrigger>
                  <Button
                     className={`rounded-full border-[0px] border-neutral-300 !p-3 !h-fit`} variant={`ghost`}
                  >
                     <Earth size={20} />
                  </Button>
               </TooltipTrigger>
               <TooltipContent
                  side={`bottom`}
                  className={`dark:bg-white dark:text-black bg-black`}>Website</TooltipContent>
            </Tooltip>
         </TooltipProvider>
         <TooltipProvider>
            <Tooltip>
               <TooltipTrigger>
                  <Button className={`rounded-full border-[0px] border-neutral-300 !p-3 !h-fit`} variant={`ghost`}
                  >
                     <MessagesSquare size={20} />
                  </Button>
               </TooltipTrigger>
               <TooltipContent
                  side={`bottom`}
                  className={`dark:bg-white dark:text-black bg-black`}>Message</TooltipContent>
            </Tooltip>
         </TooltipProvider>
         <DropdownMenu>
            <DropdownMenuTrigger>
               <Button
                  className={`rounded-full !p-3 !h-fit border-[0px] border-neutral-300 focus:ring-0 focus-visible:ring-0`}
                  variant={`ghost`}
               >
                  <Ellipsis size={20} />
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`shadow-md rounded-lg `}>
               {isMe ? (
                  <Fragment>
                     <Link href={`/account/settings`}>
                        <DropdownMenuItem className={`p-3 text-md cursor-pointer gap-4 !px-6`}>
                           <Pencil className={``} size={16} />
                           Edit Profile
                        </DropdownMenuItem>
                     </Link>
                     <DropdownMenuItem
                        onClick={_ => openModal(ModalType.SHARE_PROFILE)}
                        className={`p-3 text-md gap-4 !px-6 cursor-pointer`}>
                        <Share2 size={16} />
                        Share Profile
                     </DropdownMenuItem>

                  </Fragment>
               ) : (
                  <><DropdownMenuItem className={`p-3 text-md gap-4 !px-6`}>
                     <Share2 size={16} />
                     Share Profile
                  </DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem
                     className={`p-3 text-md !text-red-500 gap-4 !px-6 hover:text-red-500`}>
                     <Flag className={`text-red-500`} size={16} />
                     Block user
                  </DropdownMenuItem></>
               )}

            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

export default RightSection;