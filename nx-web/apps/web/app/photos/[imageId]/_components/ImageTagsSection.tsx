"use client"
import React from "react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { cn } from "@utils";
import { ImageSummary } from "../_queries";
import { useIsDarkMode } from "../../../../hooks/useIsDarkMode";

export interface ImageTagsSectionProps {
   image: ImageSummary;
}

const ImageTagsSection = ({ image }: ImageTagsSectionProps) => {
   const darkMode = useIsDarkMode();
   return (
      <div className={`mt-8 flex items-center gap-3`}>
         {image.tags.map((tag, index) => (
            <Button asChild key={index}
                    variant={darkMode ? `default` : `outline`}
                    className={cn(`rounded-lg `,
                       !darkMode && `hover:border-black hover:bg-white`
                    )}>
               <Link href={`/search?q=${encodeURIComponent(tag.toLowerCase())}`}>
                  {tag.toLowerCase()}
               </Link>
            </Button>
         ))}

      </div>
   );
};

export default ImageTagsSection;