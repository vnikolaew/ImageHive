"use client";
import React, { Fragment, useMemo } from "react";
import DefaultAvatar from "../../../../public/default-avatar.png";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import { Ellipsis, Languages } from "lucide-react";
import { useIsDarkMode } from "@web/hooks/useIsDarkMode";
import { ImageComment } from "./ImageCommentsSection";
import {
   API_ROUTES,
   cn,
} from "@nx-web/shared";
import { ImageCommentsApiResponse } from "../../../api/comments/[imageId]/route";
import { LoadingSpinner } from "@web/components/modals/SocialLogins";
import { Skeleton } from "@components/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/dropdown-menu";
import { Button } from "@components/button";
import { ScrollArea } from "@components/scroll-area";
import {
   useInfiniteQuery,
} from "@tanstack/react-query";

export interface ImageCommentsProps {
   comments: ImageComment[];
   hasMore?: boolean;
}

function dateSorter(a: ImageComment, b: ImageComment) {
   // @ts-ignore
   return new Date(b.createdAt) - new Date(a.createdAt);
}

const DEFAULT_LIMIT = 10;

const ImageComments = ({ comments: initialComments }: ImageCommentsProps) => {
   const darkMode = useIsDarkMode();
   const imageId = initialComments.at(0)?.imageId;

   const {
      data: comments,
      isLoading: qLoading,
      fetchNextPage,
   } = useInfiniteQuery<ImageComment[], any, any, [string, string]>({
      queryKey: [API_ROUTES.COMMENTS, imageId],
      queryFn: async ({ pageParam, queryKey }) => {
         const res = await fetch(`${API_ROUTES.COMMENTS}/${imageId}?page=${pageParam}&limit=${DEFAULT_LIMIT}`, {});
         const body: ImageCommentsApiResponse = await res.json();
         return body.imageComments as ImageComment[];
      },
      initialData: { pages: [initialComments], pageParams: [0] },
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => (pages?.length ?? 0) + 1,
   });

   const allComments = useMemo(() => {
      return [...initialComments, ...(comments?.pages?.flatMap(p => p) ?? [])];
   }, [comments, initialComments]);

   const hasMore = useMemo(() => {
      // @ts-ignore
      return comments?.pages?.at(-1)?.length === 0;
   }, [comments]);

   async function handleLoadMoreComments() {
      await fetchNextPage();
   }

   function handleTranslateComment(comment: ImageComment) {
      const url = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(comment.raw_text)}&op=translate`;
      window.open(url, "_blank");
   }

   return (
      <ScrollArea className={`h-[300px] relative mt-8 rounded-md`}>
         <div className={cn(`absolute top-0 left-0 w-full h-[300px] bg-transparent`, !darkMode && `shadow-test`)}></div>
         <div className={`flex relative flex-col pb-8 gap-6 border-none px-2 rounded-md`}>
            {qLoading &&
               <Fragment>
                  {Array.from({ length: 3 }).map((_, i) => (
                     <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[300px]" />
                           <Skeleton className="h-3 w-[200px]" />
                        </div>
                     </div>
                  ))}
               </Fragment>

            }
            {allComments.sort(dateSorter).map((comment, i) => (
               <div className={`w-full flex items-center justify-between `} key={comment.id + i}>
                  <div className={`flex items-center gap-4`}>
                     <Link href={`/users/${comment.user.id}`}>
                        <Image height={36} width={36}
                               className={`rounded-full cursor-pointer shadow-md w-10 h-10 hover:opacity-80 transition-opacity duration-200`}
                               src={comment.user.image ?? DefaultAvatar} alt={comment!.user?.name! ?? ``} />
                     </Link>
                     <div className={`flex flex-col gap-0 justify-between items-start`}>
                        <div className={`flex items-baseline gap-2`}>
                           <h2 className={`font-semibold text-md text-neutral-500`}>{comment.user.name}</h2>
                           <time
                              className={`text-xs font-normal text-neutral-500`}>{moment(comment.createdAt).fromNow()}</time>
                        </div>
                        <p className={`text-sm text-neutral-500 dark:text-neutral-200 font-normal`}>{comment.raw_text}</p>
                     </div>
                  </div>
                  <div className={`mr-4`}>
                     <DropdownMenu>
                        <DropdownMenuTrigger>
                           <Button
                              className={`rounded-full !py-0 !px-5 !h-7`}
                              variant={darkMode ? `ghost` : `secondary`}>
                              <Ellipsis size={12} />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={`p-2 rounded-lg`}>
                           <DropdownMenuItem
                              onClick={_ => handleTranslateComment(comment)}
                              className={`cursor-pointer flex items-center gap-2 min-w-[200px]`}>
                              <Languages size={12} />
                              Translate
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </div>
            ))}
            <div className={`w-full flex items-center justify-center`}>
               {hasMore && (
                  <Button
                     disabled={qLoading} onClick={handleLoadMoreComments} variant={`ghost`}
                     className={`rounded-full !px-8 shadow-sm`}>
                     {qLoading ? (
                        <LoadingSpinner text="Loading..." />
                     ) : `Show more`}
                  </Button>
               )}
            </div>
         </div>
      </ScrollArea>
   );
};

export default ImageComments;
