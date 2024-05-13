import { cache } from "react";
import { xprisma } from "@nx-web/db";
import moment from "moment/moment";
import { z } from "zod";
import { Image } from "@prisma/client";

export const getSimilarTags = cache(async (tag: string) => {
   const response = await xprisma.tag.similaritySearch(tag, 10);
   return response;
})


const paramsSchema = z.object({
   date: z.union([z.literal(`7d`), z.literal(`1d`), z.literal(`3d`), z.literal(`6m`), z.literal(`12m`)]),
   orientation: z.union([z.literal(`horizontal`), z.literal(`vertical`)]).catch(`horizontal`),
});

export const getImagesFromSearch = cache(async (q: string, searchParams: Record<string, string>) => {
   q = q.toLowerCase().trim();

   const x = paramsSchema.safeParse(searchParams);

   const dateFilter = x.success ? [x.data.date.slice(0, x.data.date.length - 1), x.data.date.at(-1)] : null;
   const fromDate = !!dateFilter ?
      //@ts-ignore
      moment(Date.now()).subtract(Number(dateFilter[0]), dateFilter[1] === `m` ? `M` : dateFilter[1]).toDate()
      : null;
   const filters = { date: fromDate };

   let imageHits: Image[];
   switch (searchParams.order) {
      case `Latest`:
         imageHits = await xprisma.image.search_Latest(q, filters);
         break;
      case `Editor's choice`:
         imageHits = await xprisma.image.search(q, filters);
         break;
      case `Most relevant`:
         imageHits = await xprisma.image.search_MostRelevant(q, filters);
         break;
      case `Trending`:
         imageHits = await xprisma.image.search_Trending(q, filters);
         break;
      default:
         imageHits = await xprisma.image.search(q, filters);
         break;
   }
   return imageHits;
})
