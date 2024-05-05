import React from "react";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import MessagesSection from "@web/app/account/messages/_components/MessagesSection";

export interface PageProps {
}

const Page = async ({}: PageProps) => {
   const session = await auth();
   const outbox = await xprisma.user.outbox({
      userId: session?.user.id!,
   });

   return (
      <div className={`w-full`}>
         <MessagesSection outbox={outbox} />
      </div>
   );
};

export default Page;
