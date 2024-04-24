import React from "react";
import { xprisma } from "@/lib/prisma";
import { sleep } from "@/lib/utils";
import { AddCommentSection } from "@/app/photos/[imageId]/_components/AddCommentSection";
import { Prisma } from "@prisma/client";
import ImageComments from "@/app/photos/[imageId]/_components/ImageComments";
import { randomUUID } from "node:crypto";
import moment from "moment";

export interface ImageCommentsSectionProps {
   imageId: string;
}

export interface ImageComment {
   imageId: string;
   user: { image: string | null; id: string; name: string | null };
   userId: string;
   metadata: Prisma.JsonValue;
   createdAt: Date;
   updatedAt: Date;
   id: string;
   is_deleted: boolean;
   raw_text: string;
}

const ImageCommentsSection = async ({ imageId }: ImageCommentsSectionProps) => {
   await sleep(1000);
   const total = await xprisma.imageComment.count({
      where: { imageId },
   });

   const imageComments = await xprisma.imageComment.findMany({
      where: { imageId },
      orderBy: { createdAt: `desc` },
      include: {
         user: {
            select: { id: true, image: true, name: true },
         },
      },
   });

   console.log({ imageComments, total });

   return (
      <div className={`mt-8`}>
         <h2 className="text-xl font-bold text-gray-900">
            {imageComments.length + 10} comments.
         </h2>
         <AddCommentSection imageId={imageId} />
         <ImageComments hasMore comments={[
            ...Array.from({ length: 10 }).map((_, i) => (
               {
                  imageId,
                  user: { image: `https://randomuser.me/api/portraits/men/34.jpg`, id: randomUUID(), name: `John` },
                  userId: randomUUID(),
                  metadata: {},
                  createdAt: moment(new Date()).subtract(3, `day`).toDate(),
                  updatedAt: new Date(),
                  id: randomUUID(),
                  is_deleted: false,
                  raw_text: `Some cool comment ${i + 1}`,
               }
            )),
         ]} />
      </div>
   );
};

export default ImageCommentsSection;