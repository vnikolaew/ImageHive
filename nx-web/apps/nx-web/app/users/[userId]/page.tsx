import React from "react";

import { notFound } from "next/navigation";
import { getUser } from "./_queries";
import { getImageSavesIds, getLikedImageIds } from "../../_queries";
import UserProfileSection from "../_components/UserProfileSection";
import { Button, cn } from "@nx-web/shared";
import { GridColumn } from "../../_components/GridColumn";

export interface PageProps {
   params: { userId: string };
}

const Page = async ({ params: { userId } }: PageProps) => {
   const success = await getUser(userId);
   if (!success) return notFound();

   const { user, isMe, amIFollower } = success;

   const [likedImageIds, savedImageIds] = await Promise.all([
      getLikedImageIds(),
      getImageSavesIds(),
   ]);

   const firstColumn = user.images.filter((_, index) => index % 4 === 0);
   const secondColumn = user.images.filter((_, index) => index % 4 === 1);
   const thirdColumn = user.images.filter((_, index) => index % 4 === 2);
   const fourthColumn = user.images.filter((_, index) => index % 4 === 3);

   return (
      <main className="flex min-h-screen flex-col items-center justify-start ">
         <div
            style={{
               background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
               backgroundImage: `url('/dark-banner.png')`,
               backgroundPosition: `center center`,
               backgroundSize: `cover`,
               // opacity: `50%`
            }}
            className="w-full h-[300px] !z-10 flex items-center relative justify-center flex-col"
         >
         </div>
         <div className={`w-5/6 relative min-h-[60vh]`}>
            <UserProfileSection isMe={isMe} amIFollower={amIFollower} user={user} />
            <div className={`mt-12`}>
               <Button size={`lg`} variant={`secondary`}
                       className={cn(`gap-2 rounded-full !px-6 shadow-sm transition-colors duration-200`)}>Images</Button>
               <div className={`w-full mt-6 grid grid-cols-4 items-start gap-8 px-0`}>
                  {[firstColumn, secondColumn, thirdColumn, fourthColumn].map((column, index) => (
                     <GridColumn
                        savedImages={savedImageIds} likedImageIds={likedImageIds} key={index}
                        images={column} />
                  ))}
               </div>
            </div>
         </div>
      </main>
   );
};

export default Page;
