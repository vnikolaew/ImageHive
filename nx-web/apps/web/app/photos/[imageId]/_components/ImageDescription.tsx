import React from "react";
import { Bot } from "lucide-react";
import { ImageSummary } from "../_queries";
import { Badge } from "@components/badge";

export interface ImageDescriptionProps {
   image: ImageSummary
}

function upperCase(str: string): string {
   if(!str?.length) return str;
   return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;
}


const ImageDescription = ({image}: ImageDescriptionProps) => {
   return (
      <div className={`mt-8 flex items-center gap-3`}>
         {!!image.metadata?.aiGenerated && (
           <Badge className={`shadow-sm`} variant={`secondary`} color="secondary">
              <Bot size={20} />
              <span className={`ml-2 text-sm !px-1 !py-.5`}>AI Generated</span>
           </Badge>
         )}
         <p className={`text-md`}>
            {image.tags.filter(x => !!x.length).map(upperCase).slice(0, 3).join(`, `)} image. Free for use.
         </p>
      </div>
   );
};

export default ImageDescription;
