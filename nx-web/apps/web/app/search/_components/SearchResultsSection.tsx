import React from "react";
import { z } from "zod";
import moment from "moment";
import { xprisma } from "@nx-web/db";
import { getLikedImageIds } from "@web/app/_queries";
import SimilarTagsSection from "./SimilarTagsSection";
import { GridColumn } from "@web/app/_components/GridColumn";

export interface SearchResultsSectionProps {
   search: string;
   params: Record<string, string>;
}

const paramsSchema = z.object({
   date: z.union([z.literal(`7d`), z.literal(`1d`), z.literal(`3d`), z.literal(`6m`), z.literal(`12m`)]),
   orientation: z.union([z.literal(`horizontal`), z.literal(`vertical`)]).catch(`horizontal`),
});

type SearchParams = z.infer<typeof paramsSchema>

const SearchResultsSection = async ({ search, params }: SearchResultsSectionProps) => {
   search = search.toLowerCase().trim();

   const x = paramsSchema.safeParse(params);

   const dateFilter = x.success ? [x.data.date.slice(0, x.data.date.length - 1), x.data.date.at(-1)] : null;
   const fromDate = !!dateFilter ?
      //@ts-ignore
      moment(Date.now()).subtract(Number(dateFilter[0]), dateFilter[1] === `m` ? `M` : dateFilter[1]).toDate()
      : null;
   const filters = { date: fromDate };

   let imageHits: any[];
   switch (params.order) {
      case `Latest`:
         imageHits = await xprisma.image.search_Latest(search, filters);
         break;
      case `Editor's choice`:
         imageHits = await xprisma.image.search(search, filters);
         break;
      case `Most relevant`:
         imageHits = await xprisma.image.search_MostRelevant(search, filters);
         break;
      case `Trending`:
         imageHits = await xprisma.image.search_Trending(search, filters);
         break;
      default:
         imageHits = await xprisma.image.search(search, filters);
         break;
   }

   const likedImageIds = await getLikedImageIds();

   const columns = Array
      .from({ length: 4 })
      .map((_, i) => i)
      .map(x => imageHits.filter((_, index) => index % 4 === x));

   return (
      <div className={`p-8 flex items-start flex-col gap-4 px-24`}>
         <h2 className={`text-3xl font-semibold`}>
            {`${search[0].toUpperCase()}${search.slice(1).toLowerCase()}`} Images & Pictures
         </h2>
         <p className={`text-sm font-normal text-neutral-500`}>
            {imageHits.length}+ beautiful {search} photos & stock images. Download your favorite royalty
            free {search} pictures in HD
            to 4K quality as wallpapers,
            backgrounds & more.
         </p>
         <div className={`mt-4`}>
            <SimilarTagsSection tag={search} />
         </div>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-0`}>
            {columns.map((column, index) => (
               <GridColumn likedImageIds={likedImageIds} key={index + 1} images={column} />
            ))}
         </div>

      </div>
   );
};

export default SearchResultsSection;