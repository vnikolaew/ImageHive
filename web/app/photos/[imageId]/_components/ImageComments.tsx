import React from "react";
import { ImageComment } from "@/app/photos/[imageId]/_components/ImageCommentsSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import moment from "moment";

export interface ImageCommentsProps {
   comments: ImageComment[];
}

const ImageComments = ({ comments }: ImageCommentsProps) => {
   return (
      <ScrollArea className={`h-[300px] mt-8`}>
         {comments.map((comment, i) => (
            <div className={`w-full flex items-center justify-between`} key={comment.id}>
               <div className={`flex items-center gap-4`}>
                  <Image height={36} width={36}
                         className={`rounded-full cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                         src={comment.user.image!} alt={comment!.user?.name! ?? ``} />
                  <div className={`flex flex-col gap-1 justify-between items-start`}>
                     <div className={`flex items-baseline gap-2`}>
                        <h2 className={`font-semibold text-md`}>{comment.user.name}</h2>
                        <time className={`text-xs font-normal text-neutral-500`}>{moment(comment.createdAt).fromNow()}</time>
                     </div>
                     <p className={`text-sm text-neutral-500 font-normal`}>{comment.raw_text}</p>
                  </div>
               </div>
               <div>Hi</div>
            </div>
         ))}

      </ScrollArea>
   );
};

export default ImageComments;