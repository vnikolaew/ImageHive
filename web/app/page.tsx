import { xprisma } from "@/lib/prisma";
import HomeSearchBar from "@/app/_components/HomeSearchBar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import TopTagsSection from "@/app/_components/TopTagsSection";
import HomeFeedSection from "@/app/_components/HomeFeedSection";
import React, { Suspense } from "react";
import HomeFeedSectionLoading from "@/app/_components/HomeFeedSectionLoading";

interface HomeProps {
   searchParams: { hideAi?: string, order?: string };
}

export const FeedSortOptions = [
   `Latest`,
   `Trending`,
   `Editor's choice`,
] as const;

export default async function Home(props: HomeProps) {
   const hideAi = props.searchParams.hideAi === `true`;
   const imagesCount = await xprisma.image.count();
   console.log({ props });

   return (
      <main className="flex min-h-screen flex-col items-center justify-start gap-12">
         <div style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
            backgroundImage: `url('sunset.jpg')`,
            backgroundPosition: `center top`,
            backgroundSize: `cover`,
            // opacity: `50%`
         }} className="w-full h-[450px] !z-1 flex items-center relative justify-center flex-col">
            <div className={`flex flex-col items-start gap-2`}>
               <h1 className={`font-semibold text-3xl text-white/100 `}>
                  Find inspiration in our curated collection of royalty-free images
               </h1>
               <h2 className={`text-white/80`}>
                  Over {imagesCount} high quality stock images posted by our talented community.
               </h2>
               <HomeSearchBar />
            </div>
            <div
               className={`justify-self-end absolute bottom-6 left-6 flex items-center justify-between text-xs text-neutral-300`}>
               Read more about our <Link href={`/service/terms`} className={cn(`ml-1 underline hover:text-white`)}>
               Content License
            </Link>
            </div>
         </div>
         <div className={`w-3/4`}>
            <TopTagsSection hideAi={hideAi} />
            <Suspense fallback={<HomeFeedSectionLoading />}>
               <HomeFeedSection order={props.searchParams.order as any ?? `Latest`} hideAi={hideAi} />
            </Suspense>
         </div>
      </main>

   );
}
