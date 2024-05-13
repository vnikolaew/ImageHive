import React from "react";
import Link from "next/link";
import { Badge } from "@components/badge";
import { getSimilarTags } from "@web/app/search/_queries";

export interface SimilarTagsSectionProps {
   tag: string;
}

const SimilarTagsSection = async ({ tag }: SimilarTagsSectionProps) => {
   const response = await getSimilarTags(tag)

   return (
      <div className={`w-full flex items-center gap-3`}>
         {response
            .sort((a, b) => a[1] - b[1])
            .filter(x => x[0].metadata.name.toLowerCase() !== tag)
            .map(x => x[0].metadata.name)
            .map((tag, i) => (
               <Link key={i} href={`/search?q=${encodeURIComponent(tag.toLowerCase())}`}>
                  <Badge
                     className={`text-sm !px-4 !py-1 cursor-pointer bg-white text-neutral-600 hover:border-[1px] hover:border-black transition-colors duration-300`}
                     variant={`outline`} key={i}>{tag}</Badge>
               </Link>
            ))}
      </div>
   );
};

export default SimilarTagsSection;
