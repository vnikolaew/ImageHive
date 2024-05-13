"use client";
import React, { useEffect, useRef } from "react";
import { FeedSortOptions } from "../page";
import { API_ROUTES, ApiResponse } from "@nx-web/shared";
import { GridColumn } from "./GridColumn";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Image } from "@prisma/client";
import { Button } from "@components/button";
import { LoadingSpinner } from "@web/components/modals/SocialLogins";
import HomeFeedSectionLoading from "@web/app/_components/HomeFeedSectionLoading";


interface HomeFeedSectionProps {
   hideAi?: boolean,
   order: (typeof FeedSortOptions)[number],
   likedImageIds: Set<string> | Set<any>,
   savedImages: Set<string> | Set<any>
}

const DEFAULT_LIMIT = 20;

const HomeFeedSection = ({ hideAi, order, likedImageIds, savedImages }: HomeFeedSectionProps) => {
   const { data: feed, isLoading, error, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
      queryKey: [API_ROUTES.FEED],
      queryFn: ({ pageParam }) => fetch(`${API_ROUTES.FEED}?page=${pageParam}&limit=${DEFAULT_LIMIT}&order=${order}&hideAi=${hideAi}`).then(res => res.json()) as unknown as ApiResponse<{
         images: Image[],
         total: number,
         hasMore: boolean
      }>,
      initialPageParam: 1,
      getNextPageParam: (_, __, lastPageParam) => lastPageParam + 1,
   });
   const feedRef = useRef<HTMLDivElement>(null!);

   console.log({
      feed,
      total: feed?.pages?.flatMap(p => p?.data?.images?.length ?? 0).reduce((acc, curr) => acc + curr, 0),
   });

   useEffect(() => {
      if (feed?.pages?.length > 1) {
         feedRef.current?.scrollIntoView({ block: `end`, behavior: "smooth" });
      }
   }, [feed?.pages?.length]);

   const columns = Array
      .from({ length: 4 })
      .map((_, i) => i)
      .map(x => feed?.pages?.flatMap(p => p?.data?.images ?? [])?.filter((_, index) => index % 4 === x) ?? []);

   return (
      <section className={`w-full mt-8`}>
         <h2 className={`text-2xl px-12 font-semibold`}>
            Home Feed
         </h2>
         <div id={`feed-container`} ref={feedRef} className={`w-full mt-8 grid grid-cols-4 items-start gap-8 px-12`}>
            {columns.map((column, index) => (
               <GridColumn savedImages={savedImages} likedImageIds={likedImageIds} key={index} images={column} />
            ))}
         </div>
         <div className={`mt-8 w-full flex items-center justify-center`}>
            {isFetchingNextPage && (
               <HomeFeedSectionLoading />
            )}
            {!!feed?.pages?.length && (feed?.pages?.at(-1)?.data?.hasMore ?? false) && !isFetchingNextPage && (
               <Button
                  disabled={(isFetchingNextPage || isLoading)}
                  onClick={_ => fetchNextPage()}>
                  Load more
               </Button>
            )}
            {isFetchingNextPage &&
               <div className={`w-full`}>
                  <LoadingSpinner text={`Loading ...`} />
               </div>
            }
         </div>
      </section>
   );
};


export default HomeFeedSection;
