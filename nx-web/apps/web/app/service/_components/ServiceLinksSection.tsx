"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@utils";

export interface ServiceLinksSectionProps {
}


const LINKS = [
   {
      href: `about`,
      label: `About us`,
   },
   {
      href: `faq`,
      label: `FAQ`,
   },
   {
      href: `license-summary`,
      label: `License Summary`,
   },
   {
      href: `terms`,
      label: `Terms of Service`,
   },
   {
      href: `privacy`,
      label: `Privacy Policy`,
   },
   {
      href: `cookies`,
      label: `Cookies Policy`,
   },
   {
      href: `report`,
      label: `Report content`,
   },
   {
      href: `forum`,
      label: `Forum`,
   },
] as const;

const ServiceLinksSection = ({}: ServiceLinksSectionProps) => {
   let pathname = usePathname();

   return (
      <>
         {LINKS.map((link) => (
            <Link className={cn(`text-sm cursor-pointer`,
               pathname.endsWith(link.href) && `text-blue-500 font-semibold cursor-auto`)} href={`/service/${link.href}`}
                  key={link.label}>{link.label}</Link>
         ))}
      </>
   );
};

export default ServiceLinksSection;
