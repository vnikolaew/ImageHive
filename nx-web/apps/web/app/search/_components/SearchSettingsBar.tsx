"use client";
import React from "react";
import SearchSettingsFilter from "./SearchSettingsFilter";
import SearchSettings from "../../_components/SearchSettings";
import { GenericSortDropdown } from "../../_components/GenericSortDropdown";

export interface SearchSettingsBarProps {
   hideAi?: boolean
}

export const SortOptions = [
   `Latest`,
   `Trending`,
   `Editor's choice`,
   `Most relevant`,
] as const;

const SearchSettingsBar = ({hideAi}: SearchSettingsBarProps) => {
   return (
      <div className={`w-full p-8 !px-12 border-b-[1px] flex items-center justify-between`}>
         <div>
            <SearchSettingsFilter />
         </div>
         <div className={`flex items-center gap-6`}>
            <SearchSettings hideAi={!!hideAi} />
            <GenericSortDropdown
               onChange={_ => window.location.reload()} qsKey={`order`} options={SortOptions} />
         </div>
      </div>
   );
};

export default SearchSettingsBar;
