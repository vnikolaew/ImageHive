import React from "react";
import { xprisma } from "@/lib/prisma";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GridColumn } from "@/app/_components/GridColumn";
import { getImageLikes, getImageSavesIds } from "@/app/_components/HomeFeedSection";
import UserProfileSection from "@/app/users/_components/UserProfileSection";
import { auth } from "@/auth";

export interface PageProps {
   params: { userId: string };
}

const Page = async ({ params: { userId } }: PageProps) => {
   const session = await auth();
   const user = await xprisma.user.findUnique({
      where: { id: userId },
      include: {
         images: {
            take: 20,
            include: {
               _count: { select: { likes: true } },
            },
         },
         profile: true,
         accounts: true,
         _count: { select: { followedBy: true, imageDownloads: true, imageLikes: true, following: true } },
      },
   });
   if (!user) return notFound();

   const amIFollower = (await xprisma.follows.count({
      where: { followerId: session?.user?.id, followingId: user.id },
   })) > 0;

   const isMe = user.id === session?.user?.id as string;

   const [likedImages, savedImageIds] = await Promise.all([
      getImageLikes(),
      getImageSavesIds()
   ])

   const likedImageIds = new Set<string>(likedImages.map(i => i.imageId));

   const firstColumn = user.images.filter((_, index) => index % 4 === 0);
   const secondColumn = user.images.filter((_, index) => index % 4 === 1);
   const thirdColumn = user.images.filter((_, index) => index % 4 === 2);
   const fourthColumn = user.images.filter((_, index) => index % 4 === 3);

   const { verifyPassword, updatePassword, ...rest } = user;
   //@ts-ignore
   rest.accounts = rest.accounts.map(a => {
      const { deleteResetToken, ...rest } = a;
      return rest;
   });

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
            <UserProfileSection isMe={isMe} amIFollower={amIFollower} user={rest} />
            <div className={`mt-12`}>
               <Button size={`lg`} variant={`secondary`}
                       className={cn(`gap-2 rounded-full !px-6 shadow-sm transition-colors duration-200`)}>Images</Button>
               <div className={`w-full mt-6 grid grid-cols-4 items-start gap-8 px-0`}>
                  {[firstColumn,secondColumn, thirdColumn, fourthColumn].map((column, index) => (
                     <GridColumn savedImages={savedImageIds} likedImageIds={likedImageIds} key={index} images={column} />
                  ))}
               </div>
            </div>
         </div>
      </main>
   );
};

export default Page;