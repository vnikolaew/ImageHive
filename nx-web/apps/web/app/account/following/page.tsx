import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@web/auth";
import { getUserFollowings } from "./_queries";
import FollowingCard from "./_components/FollowingCard";
import { UserRoundX } from "lucide-react";

export interface PageProps {
}

const Page = async ({}: PageProps) => {
   const session = await auth();
   if (!session) return notFound();

   const following = await getUserFollowings();

   return (
      <div className={`flex items-center gap-4 mt-8`}>
        {!following?.length && (
          <div className={`flex flex-col mt-8 items-center justify-center gap-3 w-full`}>
            <UserRoundX size={28}/>
            <span className={`text-neutral-500 text-lg`}>
              You&apos;re not following anyone yet.
            </span>
          </div>
        )}
         {following.map((f, i) => (
            <FollowingCard key={i} following={f.following} />
         ))}
      </div>
   );
};

export default Page;
