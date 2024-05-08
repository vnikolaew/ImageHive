import React from "react";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import MessagesSection from "../_components/MessagesSection";

export interface PageProps {
   searchParams: { qs?: string };
}

const Page = async ({ searchParams }: PageProps) => {
   const session = await auth();
   const inbox = await xprisma.user.inbox({
      userId: session?.user.id!,
      filter: searchParams.qs ?? ``
   });
   console.log({ inbox });

   return (
      <div>
         <MessagesSection value={`inbox`} outbox={inbox} />
      </div>
   );
};

export default Page;
