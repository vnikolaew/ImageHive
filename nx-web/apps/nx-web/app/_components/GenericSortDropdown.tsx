"use client";
import React from "react";
import { parseAsString, useQueryState } from "nuqs";
import { Select } from "@nx-web/shared";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

interface MediaSortDropdownProps {
   options: string[] | { value: string, label: string }[];
   qsKey?: string;
   onChange?: (value: string) => void;
   placeholder?: string;
}

export const GenericSortDropdown = ({ options, qsKey, onChange, placeholder }: MediaSortDropdownProps) => {
   const [sort, setSort] = useQueryState<string>(qsKey ?? `sort`,
      parseAsString.withOptions({
         history: `push`,
      }));

   //@ts-ignore
   options = typeof options[0] === `string` ? options.map(o => ({ value: o, label: o })) : options;

   return (
      <div>
         <Select
            onValueChange={value => {
               setSort(value).then(_ => onChange?.(value));
            }}
            // defaultValue={placeholder}
            value={sort}>
            <SelectTrigger className="w-[180px] rounded-full pl-4">
               <SelectValue placeholder={placeholder ?? sort ?? options[0]?.value} />
            </SelectTrigger>
            <SelectContent className="rounded-lg shadow-lg">
               {options.map(({ value, label }, index) => (
                  <SelectItem className={`my-1`} key={value} value={value}>{label}</SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   );
};
