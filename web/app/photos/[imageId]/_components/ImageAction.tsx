import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button, ButtonProps } from "@/components/ui/button";
import React from "react";

export interface ImageActionProps extends ButtonProps {
   icon?: React.ReactNode;
   text: React.ReactNode;
   tooltipText: string;
   action?: () => void;
}

export const ImageAction = ({ action, tooltipText, text, icon, ...rest }: ImageActionProps) => {
   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger className={`cursor-auto`}>
               <Button
                  onClick={() => {
                     action?.();
                  }}
                  variant={`outline`}
                  className={`bg-transparent gap-2 dark:text-neutral-300 hover:bg-transparent border-neutral-300 dark:hover:text-neutral-500 hover:border-neutral-500`}
                  {...rest}
               >
                  {icon}
                  {text}
               </Button>
            </TooltipTrigger>
            <TooltipContent
               side={`top`}
               className={`!text-xs rounded-lg bg-black text-white flex gap-1`}>
               {tooltipText}
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
};