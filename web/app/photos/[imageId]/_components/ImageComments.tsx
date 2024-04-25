"use client";
import React, { Fragment, useMemo } from "react";
import DefaultAvatar from "@/public/default-avatar.png";
import { ImageComment } from "@/app/photos/[imageId]/_components/ImageCommentsSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useSWRInfinite from "swr/infinite";
import { cn, fetcher } from "@/lib/utils";
import { ImageCommentsApiResponse } from "@/app/api/comments/[imageId]/route";
import { API_ROUTES } from "@/lib/consts";
import { Ellipsis, Loader2 } from "lucide-react";
import { LoadingSpinner } from "@/components/modals/SocialLogins";
import {
   DropdownMenu,
   DropdownMenuContent, DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsDarkMode } from "@/hooks/useIsDarkMode";

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
   const darkMode = useIsDarkMode()
   const imageId = initialComments.at(0)?.imageId;
   const { data, size, isLoading, setSize, mutate } = useSWRInfinite<ImageComment[]>((index, prevData) => {
         if (prevData && !prevData?.length) return null; // reached the end

         const key = `${API_ROUTES.COMMENTS}/${imageId}?page=${index}&limit=${DEFAULT_LIMIT}`;
         return key;
      },
      (...args: any[]) => fetcher(...args).then((res: ImageCommentsApiResponse) => res.imageComments),
      {
         fallbackData: [initialComments],
         initialSize: 1,
         keepPreviousData: true,
         onError: console.error,
      });

   const allComments = useMemo(() => {
      return [...initialComments, ...(data?.flatMap(_ => _) ?? [])];
   }, [data, initialComments]);

   const hasMore = useMemo(() => {
      // @ts-ignore
      return data?.at(-1)?.length > 0 && data?.at(-1)?.length >= DEFAULT_LIMIT;
   }, [data]);

   async function handleLoadMoreComments() {
      await setSize(size + 1);
   }

   function handleTranslateComment(comment: ImageComment) {
      const url = `https://translate.google.com/?sl=auto&tl=bg&text=${encodeURIComponent(comment.raw_text)}&op=translate`;
      window.open(url, "_blank");
   }

   return (
      <ScrollArea className={`h-[300px] relative mt-8 rounded-md`}>
         <div className={cn(`absolute top-0 left-0 w-full h-[300px] bg-transparent`, !darkMode && `shadow-test`)}></div>
         <div className={`flex relative flex-col pb-8 gap-6 border-none px-2 rounded-md`}>
            {isLoading &&
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
                           <Button className={`rounded-full !py-0 !px-6 !h-7`} variant={darkMode ? `ghost` : `secondary`}>
                              <Ellipsis size={12} />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={`p-2 rounded-lg`}>
                           <DropdownMenuItem onClick={_ => handleTranslateComment(comment)}
                                             className={`cursor-pointer min-w-[200px]`}>Translate</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </div>
            ))}
            <div className={`w-full flex items-center justify-center`}>
               {hasMore && (
                  <Button disabled={isLoading} onClick={handleLoadMoreComments} variant={`ghost`}
                          className={`rounded-full !px-8 shadow-sm`}>
                     {isLoading ? (
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