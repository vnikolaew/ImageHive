"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@utils";

const TABS = [
   {
      href: `/account/media`,
      label: `My media`,
   },
   {
      href: `/users/{userId}`,
      label: `Profile`,
   },
   {
      href: `/account/statistics`,
      label: `Statistics`,
   },
   {
      href: `/account/collections?tab=collections`,
      label: `Collections`,
   },
   {
      href: `/account/following`,
      label: `Following`,
   },
   {
      href: `/account/messages/inbox`,
      label: `Messages`,
   },
   {
      href: `/account/settings`,
      label: `Settings`,
   },
] as const;

const AccountsTabsList = () => {
   const pathname = usePathname();
   const session = useSession();

   return (
      <div className="flex items-center justify-start gap-8 border-b-[1px] w-2/3 mx-auto">
         {TABS.map((tab, index) => (
            <Link key={index}
                  href={tab.label === `Profile` ? tab.href.replace(`{userId}`, session.data?.user?.id!) : tab.href}>
               <div
                  className={cn(`border-b-[2px] border-transparent hover:border-slate-600 py-6 transition-colors duration-100`,
                     tab.href.startsWith(pathname) && `border-slate-600`)} key={index}>
                  {tab.label}
               </div>
            </Link>
         ))}
      </div>
   );
};

export default AccountsTabsList;
