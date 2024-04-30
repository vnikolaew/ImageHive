import React from "react";
import SearchSettingsBar from "@/app/search/_components/SearchSettingsBar";
import SearchResultsSection from "@/app/search/_components/SearchResultsSection";

export interface PageProps {
   searchParams: Record<string, string>;
}

export const dynamic = `force-dynamic`;

const Page = async ({ searchParams }: PageProps) => {
   console.log({ searchParams });
   return (
      <section className="min-h-[70vh] w-full text-center">
         <SearchSettingsBar hideAi={!!searchParams.hideAi}  />
         <SearchResultsSection
            order={searchParams.order as any ?? `Latest`} search={searchParams[`q`] ?? ``} />
      </section>
   );
};

export default Page;