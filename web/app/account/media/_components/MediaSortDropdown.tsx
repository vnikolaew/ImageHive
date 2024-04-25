"use client";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";

const SortOptions = {
   UploadedLatest: `Uploaded (Latest)`,
   UploadedOldest: `Uploaded (Oldest)`,
   Popularity: `Popularity`,
   Views: `Views`,
   Downloads: `Downloads`,
   Likes: `Likes`,
   Comments: `Comments`,
} as const;

interface MediaSortDropdownProps {
   sort?: string | undefined;
}

const MediaSortDropdown = ({ sort }: MediaSortDropdownProps) => {
   const [selectedSortOption, setSelectedSortOption] = useState<keyof typeof SortOptions>(() => {
      if (sort && Object.keys(SortOptions).includes(sort)) {
         return sort;
      }
      return `UploadedLatest`;
   });

   return (
      <div>
         <Select onValueChange={value => {
            const sp = new URLSearchParams(window.location.search);
            sp.set(`sort`, value);
            window.location.href = `${window.location.pathname}?${sp.toString()}`;

         }} value={selectedSortOption}>
            <SelectTrigger className="w-[180px] rounded-full pl-4">
               <SelectValue placeholder={SortOptions.UploadedLatest} />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg">
               {Object.entries(SortOptions).map(([key, value], index) => (
                  <SelectItem className={`my-1`} key={key} value={key}>{value}</SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   );
};

export default MediaSortDropdown;