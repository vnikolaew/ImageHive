import React, { Suspense } from "react";
import SearchSettingsBar from "./_components/SearchSettingsBar";
import SearchResultsSection from "./_components/SearchResultsSection";
import { similaritySearch } from "@web/app/api/similiraty-search/route";

export interface PageProps {
   searchParams: Record<string, string>;
}

export const dynamic = `force-dynamic`;

const Page = async ({ searchParams }: PageProps) => {
   const res = await similaritySearch(searchParams[`q`]);

   console.log({
      result: res.map(x => {
         return {
            tag: x[0].metadata.name,
            distance: x[0].metadata._distance,
            score: x[1]
         };
      }),
   });
   return (
      <section className="min-h-[70vh] w-full text-center">
         <SearchSettingsBar hideAi={!!searchParams.hideAi} />
         <Suspense fallback={`Loading ...`}>
            <SearchResultsSection
               params={searchParams}
               search={searchParams[`q`] ?? ``} />
         </Suspense>
      </section>
   );
};

export default Page;
