"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { APP_NAME } from "@/lib/consts";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavSearchBarProps {
   showNavbarBackground: boolean;
}

const NavSearchBar = ({ showNavbarBackground }: NavSearchBarProps) => {
   const [searchValue, setSearchValue] = useState(``);
   const inputRef = useRef<HTMLInputElement>(null!);
   const pathname = usePathname();
   const isUsersPage = pathname.startsWith(`/users`);

   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === `Enter` && document.activeElement === inputRef.current && searchValue?.length) {
            window.location.href = `/search?q=${encodeURIComponent(searchValue)}`;
         }
      };
      document.addEventListener(`keydown`, handler);

      return () => document.removeEventListener(`keydown`, handler);
   }, [searchValue]);

   return (
      <div className={cn(`w-full rounded-full relative border-[1px] dark:border-neutral-700 dark:bg-neutral-800 z-20`,
         isUsersPage && `bg-transparent backdrop-blur-sm !border-neutral-700`)}>
         <Search size={16} className={cn(`absolute top-[50%] left-3 -translate-y-1/2 cursor-pointer`,
            isUsersPage && `text-white`,
            isUsersPage && showNavbarBackground && `text-black`)} />
         <Input
            ref={inputRef}
            onChange={e => setSearchValue(e.target.value)}
            value={searchValue} placeholder={`Search ${APP_NAME}`}
            className={`rounded-full focus-visible:ring-0 border-none pl-10 dark:text-neutral-300 placeholder:text-neutral-500 text-md focus:shadow-lg`} />
      </div>
   );
};

export default NavSearchBar;