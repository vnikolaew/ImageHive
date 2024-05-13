import React, { Suspense } from "react";
import SearchSettingsBar from "./_components/SearchSettingsBar";
import SearchResultsSection from "./_components/SearchResultsSection";
import { Metadata, ResolvingMetadata } from "next";
import { getImagesFromSearch, getSimilarTags } from "@web/app/search/_queries";
import { APP_NAME } from "@nx-web/shared";
import { startCase } from "lodash";
import darkLogo from "@web/public/ImageHive-logo-dark.png"

export interface PageProps {
   searchParams: Record<string, string>;
}

export async function generateMetadata(
   { searchParams }: PageProps,
   _: ResolvingMetadata): Promise<Metadata> {
   const tag = searchParams[`q`] ?? ``;

   const similarTags = await getSimilarTags(tag);
   const images = await getImagesFromSearch(tag, searchParams);

   console.log({ similarTags: similarTags.map(t => t[0].metadata) });

   return {
      description: `User `,
      icons: darkLogo.src,
      title: `${images.length}+ Free ${startCase(tag)} & ${startCase(similarTags[1][0].pageContent)} Images - ${APP_NAME}`,
      applicationName: APP_NAME,
      category: `users`,
      openGraph: {
         siteName: APP_NAME,
         // images: [new URL(user.profilePictureImageSrc).href],
      },
      twitter: {
         // images: [new URL(user.profilePictureImageSrc).href],
         site: `@site`,
      },
   };
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
