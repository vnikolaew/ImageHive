"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface MediaSearchBarProps {
   qs: string;
   placeholder?: string
}

const MediaSearchBar = ({ qs, placeholder }: MediaSearchBarProps) => {
   const inputRef = useRef<HTMLInputElement>(null!);
   const [searchValue, setSearchValue] = useState(qs);
   const router = useRouter();

   useEffect(() => {
      const handler = (e) => {
         if (e.key === `Enter` && document.activeElement === inputRef.current && searchValue?.length) {
            window.location.href = `/account/media?qs=${encodeURIComponent(searchValue)}`;
         }
      };
      document.addEventListener(`keydown`, handler);

      return () => document.removeEventListener(`keydown`, handler);
   }, [router, searchValue]);

   function handleClearSearch() {
      window.location.href = `/account/media`;
   }

   return (
      <div className={`relative flex-1`}>
         <Search size={16} className={`absolute top-[50%] left-3 -translate-y-1/2`} />
         <Input
            value={searchValue}
            onChange={e => {
               setSearchValue(e.target.value);
            }}
            ref={inputRef}
            placeholder={placeholder ?? `Search by tag ...`}
            className={`rounded-full pl-10 w-full dark:bg-neutral-800 focus-visible:ring-0 outline-none focus:outline-none focus:border-none`} />

         {!!searchValue?.length && (
            <X onClick={handleClearSearch} size={16} className={`absolute cursor-pointer top-[50%] right-3 -translate-y-1/2 text-neutral-500`} />
         )}
      </div>
   );
};

export default MediaSearchBar;