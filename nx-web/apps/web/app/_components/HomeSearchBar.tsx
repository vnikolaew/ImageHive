"use client";
import { APP_NAME, cn } from "@nx-web/shared";
import { ChevronDown, Image, Search, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@components/input";
import {
   DropdownMenu,
   DropdownMenuContent, DropdownMenuItem,
   DropdownMenuTrigger,
} from "@components/dropdown-menu";
import { Button } from "@components/button";

export interface HomeSearchBarProps {
}

const SearchTypes = [
   {
      value: `images`,
      Icon: Image,
      label: `All images`,
   },
   {
      value: `users`,
      Icon: User,
      label: `Users`,
   },
] as const;

const HomeSearchBar = ({}: HomeSearchBarProps) => {
   const [searchValue, setSearchValue] = useState(``);
   const inputRef = useRef<HTMLInputElement>(null!);
   const [searchType, setSearchType] = useState<typeof SearchTypes[number]["value"]>(`images`);
   const [open, setOpen] = useState(false);

   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if (e.key === `Enter` && document.activeElement === inputRef.current && searchValue?.length) {
            window.location.href = `/${searchType === `users` ? `users/` : ``}search?q=${encodeURIComponent(searchValue)}`;
         }
      };
      document.addEventListener(`keydown`, handler);

      return () => document.removeEventListener(`keydown`, handler);
   }, [searchValue, searchType]);

   return (
      <div className={`w-full rounded-full relative bg-neutral-100 mt-8 p-1`}>
         <Input
            ref={inputRef}
            onChange={e => setSearchValue(e.target.value)}
            value={searchValue}
            placeholder={`Search for all images on ${APP_NAME}`}
            className={`rounded-full peer dark:bg-neutral-100 focus-visible:ring-0 border-none pl-10 text-neutral-700 placeholder:text-neutral-400 !text-base placeholder:!text-base`} />
         <Search
            size={18}
            className={`absolute peer-focus-visible:text-green-700 top-[50%] left-4 -translate-y-1/2 cursor-pointer text-neutral-500 !stroke-[3px]`} />
         <div className={
            `absolute peer-focus-visible:text-green-700 top-[50%] right-4 -translate-y-1/2 cursor-pointer text-neutral-500 !stroke-[3px]`
         }>
            <DropdownMenu onOpenChange={setOpen} open={open}>
               <DropdownMenuTrigger asChild>
                  <Button className={`rounded-full flex items-center !px-6 gap-2`} variant="outline">
                     <span>
                        {SearchTypes.find(t => t.value === searchType)!.label}
                     </span>
                     <ChevronDown className={cn(
                        open && `rotate-180 transition-all text-green-600 duration-200`,
                        !open && `rotate-0 transition-transform duration-200`,
                     )} size={16} />
                  </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56 rounded-lg p-2">
                  {SearchTypes.map((item, index) => (
                     <DropdownMenuItem
                        className={cn(`p-2 flex items-center gap-4 cursor-pointer rounded-lg`,
                           item.value === searchType && `text-green-600 `)}
                        onClick={e => {
                           setSearchType(item.value);
                        }} key={index}>
                        <item.Icon size={18} />
                        {item.label}
                     </DropdownMenuItem>
                  ))}
               </DropdownMenuContent>
            </DropdownMenu>
         </div>
      </div>
   );
};

export default HomeSearchBar;
