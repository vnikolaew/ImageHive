import React from "react";
import MediaSearchBar from "../media/_components/MediaSearchBar";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import { xprisma } from "@/lib/prisma";

export interface PageProps {
}

const Page = async ({}: PageProps) => {
   const session = await auth();
   const userCollections = await xprisma
      .imageCollection
      .findMany({
         where: {
            userId: session?.user?.id as string,
         },
         include: {
            images: {
               take: 1,
               orderBy: { createdAt: `desc` },
            },
         },
      });
   console.log({ userCollections });

   return (
      <div className={`my-12 min-h-[70vh]`}>
         <div className={`flex items-center justify-between`}>
            <h2 className={`text-3xl`}>Collections</h2>
            <div className={`flex items-center gap-4 w-2/5`}>
               <MediaSearchBar qs={``} />
            </div>
         </div>
         <Separator className={`w-full my-4 h-[2px]`} />
      </div>
   );
};

export default Page;