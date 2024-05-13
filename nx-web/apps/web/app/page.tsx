import { xprisma } from "@nx-web/db";
import Link from "next/link";
import HomeSearchBar from "./_components/HomeSearchBar";
import { Suspense } from "react";
import { cn } from "@utils";
import TopTagsSection from "./_components/TopTagsSection";
import HomeFeedSectionLoading from "./_components/HomeFeedSectionLoading";
import HomeFeedSection from "./_components/HomeFeedSection";
import { getImageSavesIds, getLikedImageIds } from "@web/app/_queries";

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

   const [likedImageIds, savedImages] = await Promise.all([
      getLikedImageIds(),
      getImageSavesIds(),
   ]);

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
               Read more about our <Link href={`/service/license-summary`} className={cn(`ml-1 underline hover:text-white`)}>
               Content License
            </Link>
            </div>
         </div>
         <div className={`w-3/4`}>
            <TopTagsSection hideAi={hideAi} />
            <Suspense fallback={<HomeFeedSectionLoading />}>
               <HomeFeedSection likedImageIds={likedImageIds} savedImages={savedImages} order={props.searchParams.order as any ?? `Latest`} hideAi={hideAi} />
            </Suspense>
         </div>
      </main>

   );
}
