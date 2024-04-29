"use client";
import React, { useMemo, useState } from "react";
import { ImageSummary } from "@/app/photos/[imageId]/page";
import moment from "moment";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { tsIsDeclarationStart } from "sucrase/dist/types/parser/plugins/typescript";

export interface ImageStatisticsProps {
   image: ImageSummary;
}

const ImageStat = ({ text, value }: { text: string, value: React.ReactNode }) => {
   return (
      <div className={`w-full text-sm xl:!text-md flex items-center justify-between`}>
         <span className={`text-sm 2xl:!text-base`}>{text}</span>
         <span className={`text-sm 2xl:!text-base`}>{value}</span>
      </div>
   );

};

const ImageStatistics = ({ image }: ImageStatisticsProps) => {
   const [showDetails, setShowDetails] = useState(false);

   const resolution = useMemo(() => {
      const [x, y] = image.dimensions[0];
      return `${x} x ${y}`;
   }, [image?.dimensions]);

   return (
      <div className={`w-full flex flex-col items-start gap-1 text-neutral-400`}>
         <ImageStat text={`Views`} value={image._count.views} />
         <ImageStat text={`Downloads`} value={image._count.downloads} />
         <Collapsible className={`w-full !mt-0`} open={showDetails} onOpenChange={setShowDetails}>
            <CollapsibleContent className={`w-full !mt-0 flex flex-col gap-1`}>
               <ImageStat text={`Saves`} value={image._count.collections} />
               <ImageStat text={`Media type`} value={image.file_format.toUpperCase()} />
               <ImageStat text={`Resolution`} value={resolution} />
               <ImageStat text={`Published date`} value={moment(image.createdAt).format(`dddd M, YYYY`)} />
            </CollapsibleContent>
            <CollapsibleTrigger>
               <Button className={`underline text-neutral-400 font-normal !px-0 text-sm 2xl:text-base mt-2`} variant={`link`}>
                  {showDetails ? `Hide` : `Show`} details <ChevronDown className={cn(`ml-1 transition-all duration-300`,
                  showDetails && `rotate-180`)} size={16} />
               </Button>
            </CollapsibleTrigger>
         </Collapsible>

      </div>
   );
};

export default ImageStatistics;