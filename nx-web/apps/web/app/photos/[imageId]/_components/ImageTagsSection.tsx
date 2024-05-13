"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@components/button";
import { cn } from "@utils";
import { ImageSummary } from "../_queries";
import { useIsDarkMode } from "@web/hooks/useIsDarkMode";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";

export interface ImageTagsSectionProps {
   image: ImageSummary;
}

const ImageTagsSection = ({ image }: ImageTagsSectionProps) => {
   const darkMode = useIsDarkMode();

   return (
      <div className={`mt-8 flex items-center gap-3 flex-wrap`}>
         {image.tags.slice(0, 7).map((tag, index) => (
            <Button
               asChild key={index}
                    variant={darkMode ? `default` : `outline`}
                    className={cn(`rounded-lg `,
                       !darkMode && `hover:border-black hover:bg-white`,
                    )}>
               <Link href={`/search?q=${encodeURIComponent(tag.toLowerCase())}`}>
                  {tag.toLowerCase()}
               </Link>
            </Button>
         ))}
         {image.tags.length > 7 && (
            <TooltipProvider>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className={`text-sm text-neutral-500`}> and {image.tags.length - 7} more.</div>
                  </TooltipTrigger>
                  <TooltipContent
                     side={`top`}
                     className={`!px-3 py-[1px] !text-[.7rem] rounded-xl bg-black text-white`}>
                     {image.tags.slice(7, image.tags.length - 1).join(`, `)} and {image.tags.at(-1)}
                  </TooltipContent>
               </Tooltip>
            </TooltipProvider>)
         }

      </div>
   );
};

export default ImageTagsSection;
