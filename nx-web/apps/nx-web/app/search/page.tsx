import React, { Suspense } from "react";
import SearchSettingsBar from "./_components/SearchSettingsBar";
import SearchResultsSection from "./_components/SearchResultsSection";

export interface PageProps {
   searchParams: Record<string, string>;
}

export const dynamic = `force-dynamic`;

const Page = async ({ searchParams }: PageProps) => {
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
