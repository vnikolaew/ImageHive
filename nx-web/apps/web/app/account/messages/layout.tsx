"use client";
import { Tabs, TabsList, TabsTrigger } from "@components/tabs";
import React, { PropsWithChildren, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface PageProps extends PropsWithChildren {
}

const Layout = ({ children }: PageProps) => {
   const pathname = usePathname();
   const value = useMemo(() =>
         pathname.split("/").at(-1)?.trim(),
      [pathname]);

   return (
      <Tabs value={value} defaultValue="account" className="col-span-2 grid grid-cols-7 items-start gap-8 mt-8">
         <TabsList className="flex flex-col !h-fit w-full col-span-2">
            <Link className={`w-full`} href={`/account/messages/inbox`}>
               <TabsTrigger
                  className={`w-full text-left p-2 !items-start !justify-start`}
                  value="inbox">
                  <span>
                     Inbox
                  </span>
               </TabsTrigger>
            </Link>
            <Link className={`w-full`} href={`/account/messages/outbox`}>
               <TabsTrigger
                  className={`w-full text-left p-2 !items-start !justify-start`}
                  value="outbox">
                  <span>
                     Outbox
                  </span>
               </TabsTrigger>
            </Link>
         </TabsList>
         <div className={`col-span-5`}>
            {children}
         </div>
      </Tabs>
   )
      ;
};

export default Layout;
