"use client";
import { cn } from "@nx-web/shared";
import { Skeleton } from "@components/skeleton";
import React from "react";

export interface HomeFeedSectionLoadingProps {
}

const HomeFeedSectionLoading = ({}: HomeFeedSectionLoadingProps) => {
   return (
      <section className={`w-full mt-8`}>
         <h2 className={`text-2xl px-12`}>
            Home Feed
         </h2>
         <div className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-12`}>
            {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className={`grid gap-8`}>
                  {Array.from({ length: 2 }).map((_, k) => (
                     <Skeleton
                        className={cn(`w-full h-72 rounded-md bg-neutral-400`, (i + k) % 2 === 1 ? `h-40` : `h-72`)}
                        key={k} />
                  ))}
               </div>
            ))}
         </div>
      </section>
   );
};

export default HomeFeedSectionLoading;
