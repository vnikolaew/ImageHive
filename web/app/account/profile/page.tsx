import React from "react";
import { auth } from "@/auth";
import { xprisma, XPrismaClient } from "@/lib/prisma";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const ProfilePage = async () => {
   const session = await auth();
   const user = (await (xprisma as XPrismaClient).user.findFirst({
      where: { id: session?.user?.id },
      include: { accounts: true },
   }))!;

   return (
      <div className={`m-12`}>
         <div className={`flex gap-4 items-center`}>
            <Image alt={user.name!} height={40} width={40} className={cn(`bg-white w-12 h-12 rounded-full shadow-md`,
               !user?.image && `p-1`)}
                   src={user?.image ?? `/default-avatar.png`} />
            <div className={`flex flex-col gap-1 items-start justify-center`}>
               <span className={`text-lg`}>{user.name}</span>
               <span className={`text-neutral-400 text-sm`}>{user.email}</span>
            </div>
         </div>
         <Separator className={`w-2/3 mt-4 !h-[2px]`} />
         <div className={`!mt-8`}>Profile page. Current session is:</div>
         <pre
            className={`bg-neutral-800 border-[1px] border-neutral-600 p-2 rounded-lg w-1/2`}>{JSON.stringify(session, null, 2)}</pre>
         <span className={`mt-4`}>Current user info is : </span>
         < pre
            className={`bg-neutral-800 border-[1px] border-neutral-600 p-2 rounded-lg w-1/2`}>{JSON.stringify(user, null, 2)}</pre>
      </div>
   );
};

export default ProfilePage;