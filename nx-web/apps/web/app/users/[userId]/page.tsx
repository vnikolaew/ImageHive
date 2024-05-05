import React from "react";

import { notFound } from "next/navigation";
import { getUser } from "./_queries";
import { getImageSavesIds, getLikedImageIds } from "@web/app/_queries";
import UserProfileSection from "../_components/UserProfileSection";
import { cn } from "@nx-web/shared";
import { GridColumn } from "@web/app/_components/GridColumn";
import { Button } from "@components/button";
import UserProfileCoverSection from "@web/app/users/[userId]/_components/UserProfileCoverSection";

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

   const columns = Array
      .from({ length: 4 })
      .map((_, i) => i)
      .map(x => user.images.filter((_, index) => index % 4 === x));

   return (
      <main className="flex min-h-screen flex-col items-center justify-start ">
         <UserProfileCoverSection isMe={isMe} coverImage={user.profile.cover_image} />
         <div className={`w-5/6 relative min-h-[60vh]`}>
            <UserProfileSection isMe={isMe} amIFollower={amIFollower} user={user} />
            <div className={`mt-12`}>
               <Button size={`lg`} variant={`secondary`}
                       className={cn(`gap-2 rounded-full !px-6 shadow-sm transition-colors duration-200`)}>Images</Button>
               <div className={`w-full mt-6 grid grid-cols-4 items-start gap-8 px-0`}>
                  {columns.map((column, index) => (
                     <GridColumn
                        savedImages={savedImageIds}
                        likedImageIds={likedImageIds} key={index}
                        images={column} />
                  ))}
               </div>
            </div>
         </div>
      </main>
   );
};

export default Page;
