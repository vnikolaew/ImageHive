"use client";
import React from "react";
import { CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";
import { APP_NAME } from "@nx-web/shared";

export interface MediaSidebarProps {
}

const MediaSidebar = ({}: MediaSidebarProps) => {
   return (
      <div>
         <div className={`w-full rounded-xl border-[1px] border-neutral-300 p-4`}>
            <div className={`flex items-center gap-2`}>
               <h2 className={`text-base font-semibold`}>Your upload limit</h2>
               <TooltipProvider>
                  <Tooltip>
                     <TooltipTrigger asChild>
                        <CircleHelp size={12} />
                     </TooltipTrigger>
                     <TooltipContent className={`!px-3 py-[1px] !text-[.7rem] rounded-xl bg-black text-white`}>
                        <b>{APP_NAME}</b> limits weekly uploads.
                     </TooltipContent>
                  </Tooltip>
               </TooltipProvider>
            </div>
            <p className={`text-neutral-500 text-sm leading-tight mt-2`}>
               You have 6 uploads remaining this week.
            </p>
         </div>
      </div>
   );
};

export default MediaSidebar;
