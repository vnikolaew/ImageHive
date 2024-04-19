import React from "react";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const Page = async () => {
   const headersList = headers();
   console.log(Object.entries(headersList));
   const fullUrl = headersList.get("referer") || "";

   console.log( {fullUrl } );
   const { pathname, searchParams } = new URL(fullUrl);
   const userId = pathname.split("/")?.at(-1)!.trim();
   const token = searchParams?.get("token");

   if(!userId) {
      return <div>No user Id supplied.</div>
   }

   if(!token) {
      return <div>No token supplied.</div>
   }

   const user = await prisma.user.findFirst( {where: { id: userId }, include: { accounts: true } });
   if(!user)  {
      return <div>User with ID {userId} was not found.</div>
   }

   const success = user.accounts.some(a => a.metadata?.reset_token === token)
   console.log({ success });

   return (
      <div className={`m-12`}>
         {/*User: {userId}*/}
      </div>
   );
};

export default Page;
