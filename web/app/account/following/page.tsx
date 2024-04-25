import React from "react";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { xprisma } from "@/lib/prisma";
import FollowingCard from "@/app/account/following/_components/FollowingCard";

export interface PageProps {
}

const Page = async ({}: PageProps) => {
   const session = await auth();
   if (!session) return notFound();

   const following = await xprisma.follows.findMany({
      where: { followerId: session.user?.id },
      include: {
         following: {
            include: {
               _count: {
                  select: {
                     images: true,
                     imageDownloads: true,
                     imageLikes: true,
                  },
               },
            },
         },
      },
   });

   console.log({ x: following.map(f => f.following) });
   return(
      <div className={`flex items-center gap-4 mt-8`}>
         {following.map(f => {
            const { updatePassword, verifyPassword, ...rest } = f.following;
            f.following = rest;
            return f;
         }).map((f, i) => (
            <FollowingCard key={i} following={f.following} />
         ))}
      </div>
   );
};

export default Page;