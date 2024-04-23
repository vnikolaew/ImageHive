"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { APP_NAME } from "@/lib/consts";

export interface NavSearchBarProps {
}

const NavSearchBar = ({}: NavSearchBarProps) => {
   const [searchValue, setSearchValue] = useState(``);
   const inputRef = useRef<HTMLInputElement>(null!);

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
      <div className={`w-full rounded-full relative border-[1px] dark:border-neutral-700 dark:bg-neutral-800`}>
         <Search size={16} className={`absolute top-[50%] left-3 -translate-y-1/2 cursor-pointer`} />
         <Input
            ref={inputRef}
            onChange={e => setSearchValue(e.target.value)}
            value={searchValue} placeholder={`Search ${APP_NAME}`}
            className={`rounded-full focus-visible:ring-0 border-none pl-10 text-neutral-300 placeholder:text-neutral-500 text-md focus:shadow-lg`} />
      </div>
   );
};

export default NavSearchBar;