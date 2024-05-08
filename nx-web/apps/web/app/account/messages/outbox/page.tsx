import React from "react";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import MessagesSection from "@web/app/account/messages/_components/MessagesSection";

export interface PageProps {
   searchParams: { qs?: string };
}

const Page = async ({searchParams}: PageProps) => {
   const session = await auth();
   const outbox = await xprisma.user.outbox({
      userId: session?.user.id!,
      filter: searchParams.qs ?? ``
   });

   return (
      <div className={`w-full`}>
         <MessagesSection value={`outbox`} outbox={outbox} />
      </div>
   );
};

export default Page;
