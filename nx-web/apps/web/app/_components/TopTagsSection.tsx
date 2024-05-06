import React from "react";
import Link from "next/link";
import { xprisma } from "@nx-web/db";
import FeedSettingsSection from "./FeedSettingsSection";
import { Badge } from "@components/badge";

interface TopTagsSectionProps {
   hideAi?: boolean;
}


const TopTagsSection = async ({ hideAi }: TopTagsSectionProps) => {
   const topTags = await xprisma.image.mostUsedTags(10);

   return (
      <div className={`w-full flex items-center px-12 justify-between`}>
         <div className={`w-full flex items-center gap-3 flex-wrap`}>
            {topTags.filter(t => t.tag !== `ai generated`).map(({ tag }, i) => (
               <Link key={i} href={`/search?q=${encodeURIComponent(tag.toLowerCase())}`}>
                  <Badge
                     className={`text-sm !px-4 !py-1 cursor-pointer bg-white text-neutral-600 hover:border-[1px] hover:border-black transition-colors duration-300`}
                     variant={`outline`} key={i}>{tag}</Badge>
               </Link>
            ))}
         </div>
         <FeedSettingsSection hideAi={!!hideAi} />
      </div>
   );
};

export default TopTagsSection;
