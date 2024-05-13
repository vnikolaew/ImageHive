"use client";
import React from "react";
import { ImageSummary } from "../_queries";
import { GridColumn } from "../../../_components/GridColumn";
import { useInfiniteQuery } from "@tanstack/react-query";
import { API_ROUTES, HTTP } from "@nx-web/shared";
import { Image } from "@prisma/client";
import HomeFeedSectionLoading from "@web/app/_components/HomeFeedSectionLoading";
import LoadingButton from "@web/components/common/LoadingButton";

export interface RelatedImagesSectionProps {
   image: ImageSummary,
   likedImageIds: Set<string>
}

const RelatedImagesSection = ({ image, likedImageIds }: RelatedImagesSectionProps) => {
   const { data: similarFeed, isLoading, isError, error, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(({
      queryKey: [API_ROUTES.SIMILAR_FEED],
      queryFn: ({ pageParam }) => fetch(`${API_ROUTES.SIMILAR_FEED}?page=${pageParam}&imageId=${encodeURIComponent(image.id)}`, {
         headers: { "Content-Type": HTTP.MEDIA_TYPES.APPLICATION_JSON },
      }).then(res => res.json()) as unknown as { data: Image[] },
      initialPageParam: 1,
      enabled: true,
      getNextPageParam: (_, __, lastPageParam) => lastPageParam + 1,
   }));

   const columns = Array
      .from({ length: 3 })
      .map((_, i) => i)
      .map(x => similarFeed?.pages?.flatMap(p => p?.data ?? []).filter((_, index) => index % 3 === x) ?? []);

   return (
      <div className={`mt-12`}>
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Similar images
         </h2>
         <div className={`w-full grid grid-cols-3 gap-8 mt-4`}>
            {columns.map((c, i) => (
               <GridColumn key={i} images={c as any[]} likedImageIds={likedImageIds} />
            ))}
         </div>
         {(isLoading || isFetchingNextPage) && (
            <HomeFeedSectionLoading cols={3} />
         )}
         {similarFeed?.pages?.length > 0 && (
            <div className={`w-full mt-4 flex items-center justify-center`}>
               <LoadingButton
                  loading={isFetchingNextPage}
                  loadingText={`Loading ...`}
                  onClick={_ => fetchNextPage()}>
                  Load more
               </LoadingButton>
            </div>
         )}
      </div>
   );
};

export default RelatedImagesSection;
