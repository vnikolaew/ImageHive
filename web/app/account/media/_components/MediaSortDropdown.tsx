"use client";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";
import { parseAsString, useQueryState } from "nuqs";

interface MediaSortDropdownProps {
   options: string[];
   qsKey?: string;
}

export const GenericSortDropdown = ({ options, qsKey }: MediaSortDropdownProps) => {
   const [sort, setSort] = useQueryState<string>(qsKey ?? `sort`,
      parseAsString.withOptions({
         history: `push`,
      }));

   return (
      <div>
         <Select onValueChange={value => {
            setSort(value);
         }} value={sort ?? options[0]}>
            <SelectTrigger className="w-[180px] rounded-full pl-4">
               <SelectValue placeholder={sort ?? options[0]} />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg">
               {options.map((o, index) => (
                  <SelectItem className={`my-1`} key={o} value={o}>{o}</SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   );
};