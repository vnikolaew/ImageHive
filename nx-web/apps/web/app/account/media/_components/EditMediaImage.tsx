"use client";
import React from "react";
import { Image } from "@prisma/client";
import { getFileName, isAbsoluteUrl } from "@utils";
import path from "path";
import {Download, ExternalLink, Eye, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";

export interface EditMediaImageProps {
   image: Image & {
      _count: {
         views: number, likes: number, downloads: number, comments: number,
      }
   };
}

const EditMediaImage = React.forwardRef<HTMLDivElement, EditMediaImageProps>(
   ({
       image,
    }: EditMediaImageProps, ref) => {
      const imageSrc = isAbsoluteUrl(image.absolute_url)
         ? image.absolute_url
         : path.join(`/uploads`, getFileName(image.absolute_url)).replaceAll(`\\`, `/`);
      console.log({ image });

      return (
         <div ref={ref} style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: `cover`,
            backgroundOrigin: `center`,
         }} className="!h-full min-w-[300px] relative sm:w-[400px] rounded-xl ">
            <div className={`absolute top-4 right-4`}>
               <Link target={`_blank`} href={`/photos/${image.id}`}>
                  <ExternalLink className={`text-white cursor-pointer !stroke-[3px]`} size={16} />
               </Link>
            </div>
            <div className={`absolute text-white bottom-4 left-4 grid grid-cols-2 !w-full gap-2`}>
               <ImageStat icon={<Eye size={14} />} count={image._count.views} tooltipMessage={`Views`} />
               <ImageStat icon={<Heart className={``} size={14} />} count={image._count.likes} tooltipMessage={`Likes`} />
               <ImageStat icon={<Download className={`fill-white`} size={14} />} count={image._count.downloads} tooltipMessage={`Downloads`} />
               <ImageStat icon={<MessageSquare className={`fill-white`} size={14} />} count={image._count.comments}
                          tooltipMessage={`Comments`} />
            </div>
         </div>
      );
   });

interface ImageStatProps {
   icon: React.ReactNode;
   count: number;
   tooltipMessage: string;
}


const ImageStat = ({ tooltipMessage, count, icon }: ImageStatProps) => {
   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild className={`cursor-auto`}>
               <div className={`text-xs !w-fit flex items-center gap-1`}>
         <span>
            {icon}
         </span>
                  <span>
            {count}
         </span>
               </div>
            </TooltipTrigger>
            <TooltipContent className={`!text-xs rounded-lg bg-black text-white`}>
               {tooltipMessage}
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
};

export default EditMediaImage;
