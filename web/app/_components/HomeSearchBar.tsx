"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { APP_NAME } from "@/lib/consts";

export interface HomeSearchBarProps {
}

const HomeSearchBar = ({}: HomeSearchBarProps) => {
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
      <div className={`w-full rounded-full relative bg-neutral-100 mt-8 p-1`}>
         <Search size={18} className={`absolute top-[50%] left-4 -translate-y-1/2 cursor-pointer text-primary`} />
         <Input
            ref={inputRef}
            onChange={e => setSearchValue(e.target.value)}
            value={searchValue} placeholder={`Search for all images on ${APP_NAME}`}
            className={`rounded-full dark:bg-neutral-100 focus-visible:ring-0 border-none pl-10 text-neutral-700 placeholder:text-neutral-400 text-md `} />
      </div>
   );
};

export default HomeSearchBar;