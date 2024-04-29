import React from "react";
import { imagesApi } from "@/lib/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface SimilarTagsSectionProps {
   tag: string;
}

async function getSimilarTags(tag: string) {
   try {
      const response = await imagesApi
         .getSimilarTagsImagesTagsSimilarTagGetRaw({ tag });
      if (!response.raw.ok) return { similarTags: [] };

      return await response.value();
   } catch (err) {
      return { similarTags: [] };
   }
}

const SimilarTagsSection = async ({ tag }: SimilarTagsSectionProps) => {
   const similarTags = await getSimilarTags(tag);
   return (
      <div className={`w-full flex items-center gap-3`}>
         {similarTags.similarTags.map(({ tag }, i) => (
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