"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";
import SearchSettings from "./SearchSettings";
import { GenericSortDropdown } from "@/app/account/media/_components/GenericSortDropdown";

export interface FeedSettingsSectionProps {
   hideAi: boolean;
}

export const FeedSortOptions = [
   `Latest`,
   `Trending`,
   `Editor's choice`,
] ;


const FeedSettingsSection = ({ hideAi }: FeedSettingsSectionProps) => {
   return (
      <div className={`flex items-center gap-8`}>
         <Separator className={`bg-neutral-200 dark:bg-neutral-200 !h-8`} orientation="vertical" />
         <SearchSettings hideAi={hideAi} />
         <GenericSortDropdown qsKey={`order`} onChange={_ => window.location.reload()} options={FeedSortOptions} />
      </div>
   );
};

export default FeedSettingsSection;