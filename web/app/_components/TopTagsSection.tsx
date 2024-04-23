import React from "react";
import { xprisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Settings, Settings2 } from "lucide-react";

export interface TopTagsSectionProps {
}

const TopTagsSection = async ({}: TopTagsSectionProps) => {
   const topTags = await xprisma.image.mostUsedTags(20);

   return (
      <div className={`w-full flex items-center px-12 justify-between`}>
         <div className={`w-full flex items-center gap-4`}>
            {topTags.map(({ tag }, i) => (
               <Link key={i} href={`/search/${tag}`}>
                  <Badge
                     className={`text-md cursor-pointer bg-white text-neutral-600 hover:border-[1px] hover:border-neutral-300 transition-colors duration-300`}
                     variant={`outline`} key={i}>{tag}</Badge>
               </Link>
            ))}
         </div>
         <div className={`flex items-center gap-8`}>
            <Separator className={`text-red-500 bg-neutral-300 !h-10`} orientation="vertical" />
            <Settings size={24} className={`text-neutral-300`} />
         </div>
      </div>
   );
};

export default TopTagsSection;