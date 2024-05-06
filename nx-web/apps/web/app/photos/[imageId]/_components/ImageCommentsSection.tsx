import React from "react";
import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import moment from "moment";
import { sleep } from "@nx-web/shared";
import { xprisma } from "@nx-web/db";
import { getImageComments } from "./_queries";
import { SignedIn, SignedOut } from "@web/components/common/Auth";
import { AddCommentSection } from "./AddCommentSection";
import ImageComments from "./ImageComments";
import CommentsSectionSignIn from "./CommentsSectionSignIn";
import { auth } from "@web/auth";
import { ServerSignedIn, ServerSignedOut } from "@web/components/common/ServerAuth";

export interface ImageCommentsSectionProps {
   imageId: string;
}

const DEFAULT_COMMENTS = (imageId: string) => [
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
];

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
   const session = await auth();
   const imageComments = await getImageComments(imageId);

   return (
      <div className={`mt-8 dark:text-white`}>
         <h2 className="text-xl font-bold ">
            {imageComments.length + 10} comments.
         </h2>
         <ServerSignedIn>
            <AddCommentSection session={session} imageId={imageId} />
            <ImageComments
               hasMore
               comments={[
                  ...DEFAULT_COMMENTS(imageId),
               ]} />
         </ServerSignedIn>
         <ServerSignedOut>
            <CommentsSectionSignIn />
         </ServerSignedOut>
      </div>
   );
};

export default ImageCommentsSection;
