"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";

const TABS = [
   {
      href: `/account/media`,
      label: `My media`,
   },
   {
      href: `/account/profile`,
      label: `Profile`,
   },
   {
      href: `/account/statistics`,
      label: `Statistics`,
   },
   {
      href: `/account/settings`,
      label: `Settings`,
   },
   {
      href: `/account/collections`,
      label: `Collections`,
   },
   {
      href: ``,
      label: ``,
   },
];
const AccountsTabsList = () => {
   const pathname = usePathname();
   return (
      <div className="flex items-center justify-start gap-8 border-b-[1px] w-2/3 mx-auto">
         {TABS.map((tab, index) => (
            <Link key={index} href={tab.href}>
               <div
                  className={cn(`border-b-[2px] border-transparent hover:border-slate-600 py-6 transition-colors duration-100`,
                     pathname === tab.href && `border-slate-600`)} key={index}>
                  {tab.label}
               </div>
            </Link>
         ))}
      </div>
   );
};

export default AccountsTabsList;