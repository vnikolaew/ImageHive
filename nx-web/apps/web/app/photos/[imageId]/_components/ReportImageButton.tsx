"use client";
import React, { useRef, useState } from "react";
import { Flag } from "lucide-react";
import { useOnClickOutside } from "next/dist/client/components/react-dev-overlay/internal/hooks/use-on-click-outside";
import { cn } from "@utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip";
import { Button } from "../../../../components/ui/button";

export interface ReportImageButtonProps {
}

const ReportImageButton = ({}: ReportImageButtonProps) => {
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement>(null!);
   useOnClickOutside(menuRef.current, e => {
      setDropdownOpen(false);
   });

   return (
      <div className={cn(`absolute hidden top-3 right-3 group-hover:block`,
         dropdownOpen && `block`)}>
         <div className={`relative`}>
            <DropdownMenu
               onOpenChange={setDropdownOpen}
               open={dropdownOpen}>
               <DropdownMenuTrigger>
                  <TooltipProvider>
                     <Tooltip>
                        <TooltipTrigger className={``} asChild>
                           <Button
                              variant={`outline`}
                              onClick={_ => setDropdownOpen(true)}
                              className={`rounded-full p-2 bg-transparent hover:bg-transparent hover:border-[1px] hover:border-white transition-colors duration-200`}
                              size={`icon`}>
                              <Flag className={`text-white`} />
                           </Button>
                        </TooltipTrigger>
                        <TooltipContent
                           side={`bottom`}
                           className={`!text-xs rounded-lg bg-black text-white flex gap-1`}>
                           Report
                        </TooltipContent>
                     </Tooltip>
                  </TooltipProvider>
               </DropdownMenuTrigger>
               <DropdownMenuContent ref={menuRef} className={`!z-[100] p-2 min-w-[160px]`}>
                  <DropdownMenuItem
                     className={`px-2 py-2 cursor-pointer`}
                     onClick={() => {
                     }}>
                     Report media
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     className={`px-2 py-2 cursor-pointer`}
                     onClick={() => {
                     }}>
                     Report tags
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     className={`px-2 !pr-4 py-2 cursor-pointer`}
                     onClick={() => {
                     }}>
                     Report description
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );
};

export default ReportImageButton;
