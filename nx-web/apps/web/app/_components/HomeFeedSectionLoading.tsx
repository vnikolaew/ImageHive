"use client";
import { cn } from "@nx-web/shared";
import { Skeleton } from "@components/skeleton";
import React from "react";

export interface HomeFeedSectionLoadingProps {
   rows?: number;
   cols?: 3 | 4;
}

const HomeFeedSectionLoading = ({ rows, cols = 4 }: HomeFeedSectionLoadingProps) => {
   return (
      <section className={`w-full mt-8`}>
         <div className={cn(`w-full mt-8 grid items-start gap-8 px-12`,
            cols === 3 && `grid-cols-3`,
            cols === 4 && `grid-cols-4`)}>
            {Array.from({ length: cols }).map((_, i) => (
               <div key={i} className={`grid gap-8`}>
                  {Array.from({ length: rows }).map((_, k) => (
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
