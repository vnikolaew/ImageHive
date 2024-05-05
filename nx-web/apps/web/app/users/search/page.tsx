import React from "react";
import { xprisma } from "@nx-web/db";
import UserCard from "@web/app/users/search/_components/UserCard";

export interface PageProps {
   searchParams: { q?: string };
}

export const dynamic = `force-dynamic`;

const Page = async (props: PageProps) => {
   console.log(props.searchParams.q);
   let users = await xprisma.user.findMany({
      where: {
         name: {
            contains: props.searchParams.q,
            mode: `insensitive`,
         },
      },
      include: {
         profile: true,
         images: {
            include: { _count: { select: { downloads: true, likes: true } } },
         },
         followedBy: { select: { followerId: true } },
         following: { select: { followerId: true } },
         _count: {
            select: {
               images: true,
               imageComments: true,
               imageLikes: true,
            },
         },
      },
   });
   users = users.map(u => {
      let { verifyPassword, updatePassword, ...rest } = u;
      return rest;
   });

   console.log({ users: users?.slice(0, 3) });

   return (
      <section className="flex min-h-screen flex-col items-center justify-start pt-24">
         <div className={`!px-12 w-full flex flex-col items-start`}>
            <h2
               className={`text-2xl font-bold text-left`}>
               {users.length} creator{users.length > 1 ? `s` : ``} found
            </h2>
            <h2
               className={`text-base font-normal text-left text-neutral-500`}>
               Showing {users.length} creator{users.length > 1 ? `s` : ``} for
               "{props.searchParams.q}"</h2>
            <div className={`grid grid-cols-3 gap-4 w-full mt-8`}>
               {users.map((user, i) => (
                  <UserCard key={i} user={user} />
               ))}
            </div>
         </div>
      </section>
   );
};

export default Page;
