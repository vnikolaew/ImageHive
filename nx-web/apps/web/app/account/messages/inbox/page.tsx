import React from "react";
import { TabsContent } from "@components/tabs";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";

export interface PageProps {
}

const Page = async ({}: PageProps) => {
   const session = await auth();
   const inbox = await xprisma.user.inbox({
      userId: session?.user.id!,
   });
   console.log({ inbox });

   return (
      <div>
         <TabsContent value={`inbox`}>Inbox</TabsContent>
      </div>
   );
};

export default Page;
