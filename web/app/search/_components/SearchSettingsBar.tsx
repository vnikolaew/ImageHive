"use client";
import React from "react";

export interface SearchSettingsBarProps {
}

const SearchSettingsBar = ({}: SearchSettingsBarProps) => {
   return (
      <div className={`w-full p-8 !px-12 border-b-[1px] flex items-center justify-between`}>
         <div>Section 1</div>
         <div>Section 2</div>
      </div>
   );
};

export default SearchSettingsBar;