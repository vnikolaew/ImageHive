import React from "react";
import { xprisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Image as IImage, Prisma } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import AccountMediaItem from "@/app/account/media/_components/AccountMediaItem";
import MediaSearchBar from "@/app/account/media/_components/MediaSearchBar";
import MediaSortDropdown from "@/app/account/media/_components/MediaSortDropdown";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Link from "next/link";

interface PageSearchParams {
   qs?: string;
   sort?: string;
}

const SortOptions = {
   UploadedLatest: `Uploaded (Latest)`,
   UploadedOldest: `Uploaded (Oldest)`,
   Popularity: `Popularity`,
   Views: `Views`,
   Downloads: `Downloads`,
   Likes: `Likes`,
   Comments: `Comments`,
};

const IMAGES_LIMIT = 10;

const Page = async ({ searchParams }: { params: any, searchParams: PageSearchParams }) => {
   const session = await auth();

   let sortClause: Prisma.ImageOrderByWithRelationAndSearchRelevanceInput | Prisma.ImageOrderByWithRelationAndSearchRelevanceInput[] | undefined;
   if (searchParams?.sort?.length && Object.keys(SortOptions).includes(searchParams.sort)) {
      switch (SortOptions[searchParams.sort as keyof typeof SortOptions]) {
         case SortOptions.UploadedLatest:
            sortClause = { createdAt: `desc` };
            break;
         case SortOptions.UploadedOldest:
            sortClause = { createdAt: `asc` };
            break;
         default:
            break;
      }
   }

   const myImages: IImage[] = await xprisma.image.findMany({
      where: {
         userId: session?.user?.id as string,
         is_deleted: false,
      },
      take: IMAGES_LIMIT,
      orderBy: sortClause,
   });

   let filteredImages = myImages;
   if (searchParams?.qs?.length) {
      filteredImages = myImages.filter(i => i.tags.some(t => t.toLowerCase().includes(searchParams.qs!.toLowerCase())));
   }

   return (
      <div className={`my-12 min-h-[70vh]`}>
         <div className={`flex items-center justify-between`}>
            <h2 className={`text-3xl`}>Media</h2>
            <div className={`flex items-center gap-4 w-2/5`}>
               <MediaSearchBar qs={searchParams?.qs ?? ``} />
               <MediaSortDropdown sort={searchParams?.sort} />
            </div>
         </div>
         <Separator className={`w-full my-4 h-[2px]`} />
         {filteredImages.length ? (
            <div className={`flex items-start gap-6 mt-8`}>
               {filteredImages.map((image, i) => (
                  <AccountMediaItem key={i} image={image} />
               ))}
            </div>
         ) : (
            <div className={`my-16 flex flex-col items-center gap-4 text-neutral-500 w-full text-center`}>
               <span className={`!text-lg`}>
                  You haven&apos;t posted any media yet.
               </span>

               <span className={`text-md`}>
                  Upload media now
               </span>

               <Button asChild className={`rounded-full gap-2 !px-12 mt-4 shadow-md`} size={`lg`} variant={`default`}>
                  <Link href={`/upload`}>
                     <Upload size={16} />
                     Upload
                  </Link>
               </Button>
            </div>
         )}
      </div>
   );
};

export default Page;