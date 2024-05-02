"use client";
import React from "react";
import { Trash } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useSearchParams } from "next/navigation";
import GenericDropdownSelect from "apps/nx-web/components/common/GenericDropdownSelect";
import { Button } from "@nx-web/shared";

export interface SearchSettingsFilterProps {
}

const SearchSettingsFilter = ({}: SearchSettingsFilterProps) => {
      const [_, setOrientation] = useQueryState<string>(`orientation`,
         parseAsString.withOptions({
            history: `push`,
         }));
      const [, setDate] = useQueryState<string>(`date`,
         parseAsString.withOptions({
            history: `push`,
         }));

      const searchParams = useSearchParams();

      function handleClearFilters() {
         const url = new URL(window.location.href);
         const sp = url.searchParams;
         const filters = [`date`, `orientation`]

         filters.forEach((filter) => {
            sp.delete(filter)
         })

         url.search = sp.toString();
         window.location.href = url.toString();
      }

      return (
         <div className={`flex items-center justify-center gap-4`}>
            <GenericDropdownSelect
               defaultValue={searchParams.get(`orientation`)} placeholder={`Orientation`} onChange={value => {
               setOrientation(value).then(_ => window.location.reload());
            }} options={[
               {
                  value: `any`,
                  label: `Orientation`,
               },
               {
                  value: `horizontal`,
                  label: `Horizontal`,
               },
               {
                  value: `vertical`,
                  label: `Vertical`,
               },
            ]
            } />
            <GenericDropdownSelect
               defaultValue={searchParams.get(`date`)} placeholder={`Published date`} onChange={value => {
               setDate(value).then(_ => window.location.reload());
            }} options={[
               {
                  value: `any`,
                  label: `Published date`,
               },
               {
                  value: `1d`,
                  label: `< 24 hours`,
               },
               {
                  value: `3d`,
                  label: `< 72 hours`,
               },
               {
                  value: `7d`,
                  label: `< 7 days`,
               },
               {
                  value: `6m`,
                  label: `< 6 months`,
               },
               {
                  value: `12m`,
                  label: `< 12 months`,
               },
            ]
            } />
            <Button onClick={handleClearFilters} variant={`ghost`} className={`px-4 gap-2 rounded-full`}>
               <Trash className={`fill-black`} size={12} />
               Clear all
            </Button>
         </div>
      );
   }
;

export default SearchSettingsFilter;
