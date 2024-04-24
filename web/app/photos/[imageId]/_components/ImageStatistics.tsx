"use client";
import React, { useMemo, useState } from "react";
import { ImageSummary } from "@/app/photos/[imageId]/page";
import moment from "moment";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageStatisticsProps {
   image: ImageSummary;
}

const ImageStatistics = ({ image }: ImageStatisticsProps) => {
   const [showDetails, setShowDetails] = useState(false);

   const resolution = useMemo(() => {
      const [x, y] = image.dimensions[0];
      return `${x} x ${y}`;
   }, [image?.dimensions]);

   return (
      <div className={`w-full flex flex-col items-start gap-1 text-neutral-400`}>
         <div className={`w-full text-sm flex items-center justify-between`}>
            <span>Views</span>
            <span>{0}</span>
         </div>

         <div className={`w-full flex items-center justify-between text-sm !mb-0`}>
            <span>Downloads</span>
            <span>{image._count.downloads}</span>
         </div>
         <Collapsible className={`w-full !mt-0`} open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleContent className={`w-full !mt-0 flex flex-col gap-1`}>
               <div className={`w-full flex items-center justify-between text-sm`}>
                  <span>Saves</span>
                  <span>{image._count.collections}</span>
               </div>

               <div className={`w-full flex items-center justify-between text-sm`}>
                  <span>Media type</span>
                  <span className={`font-semibold`}>{image.file_format.toUpperCase()}</span>
               </div>

               <div className={`w-full flex items-center justify-between text-sm`}>
                  <span>Resolution</span>
                  <span>{resolution}</span>
               </div>

               <div className={`w-full flex items-center justify-between text-sm`}>
                  <span>Published date</span>
                  <span>{moment(image.createdAt).format(`dddd M, YYYY`)}</span>
               </div>
            </CollapsibleContent>
            <CollapsibleTrigger>
               <Button className={`underline text-neutral-400 font-normal !px-0 text-sm`} variant={`link`}>
                  {showDetails ? `Hide` : `Show`} details <ChevronDown className={cn(`ml-1 transition-all duration-300`,
                  showDetails && `rotate-180`)} size={16} />
               </Button>
            </CollapsibleTrigger>
         </Collapsible>

      </div>
   );
};

export default ImageStatistics;