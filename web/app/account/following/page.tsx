import React from "react";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import FollowingCard from "@/app/account/following/_components/FollowingCard";
import { getUserFollowings } from "@/app/account/following/_queries";

export interface PageProps {
}

const Page = async ({}: PageProps) => {
   const session = await auth();
   if (!session) return notFound();

   const following = await getUserFollowings();
   console.log({ x: following.map(f => f.following) });

   return (
      <div className={`flex items-center gap-4 mt-8`}>
         {following.map((f, i) => (
            <FollowingCard key={i} following={f.following} />
         ))}
      </div>
   );
};

export default Page;