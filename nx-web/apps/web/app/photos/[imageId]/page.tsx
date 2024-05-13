import React, { Suspense } from "react";
import Image from "next/image";
import path from "path";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getImage, getImageInfo } from "./_queries";
import { auth } from "@web/auth";
import { xprisma } from "@nx-web/db";
import AIGenerated from "./_components/AIGenerated";
import ReportImageButton from "./_components/ReportImageButton";
import { APP_NAME, getFileName, isAbsoluteUrl } from "@nx-web/shared";
import ImageDescription from "./_components/ImageDescription";
import ImageCommentsSection from "./_components/ImageCommentsSection";
import ImageTagsSection from "./_components/ImageTagsSection";
import RelatedImagesSection from "./_components/RelatedImagesSection";
import ImageSummary from "./_components/ImageSummary";
import { inngest } from "@web/lib/inngest";
import { validate as isValidUUID } from "uuid";
import { Metadata, ResolvingMetadata } from "next";
import { startCase } from "lodash";
import HomeFeedSectionLoading from "@web/app/_components/HomeFeedSectionLoading";
import { getLikedImageIds } from "@web/app/_queries";

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
   const { imageId } = params;
   if (!isValidUUID(imageId)) return await parent;

   const image = await getImage(imageId);

   return {
      metadataBase: new URL(new URL(image.absolute_url).origin),
      description:
         `${image.tags.filter(x => !!x.length).map(startCase).slice(0, 3).join(`, `)} image. Free for use.`,
      title: `${!!image.title.length ? image.title : image.tags.slice(0, 3).map(startCase).join(` `)} - ${APP_NAME}`,
      applicationName: APP_NAME,
      category: `photos`,
      keywords: [...image.tags, image.title],
      openGraph: {
         images: [image.absolute_url],
      },
   };
}

export interface PageProps {
   params: { imageId: string };
}

const Page = async ({ params: { imageId } }: PageProps) => {
   const session = await auth();

   if (session?.user?.id) {
      const now = new Date();
      const imageView = await xprisma.imageView.upsert({
         where: { userId_imageId: { imageId, userId: session?.user?.id as string } },
         create: { userId: session?.user?.id!, imageId, metadata: {}, createdAt: now },
         update: { userId: session?.user?.id!, imageId, metadata: {} },
      });

      if (imageView.createdAt.getTime() === now.getTime()) {
         await inngest.send({
            name: `image/image.viewed`,
            data: {
               imageId,
               userId: session.user.id!,
               timestamp: Date.now(),
            },
         });
      }
   }

   const image = await getImage(imageId);
   const likedImageIds = await getLikedImageIds();

   if (!image) return notFound();

   const { haveILiked, haveISaved, haveIFollowed, haveIDownloaded } = await getImageInfo(image);

   return (
      <main className="m-8 grid gap-12 grid-cols-[5fr_2fr] min-h-[70vh] !max-w-[100vw]">
         <div className={`bg-transparent h-full`}>
            <div className={`w-full flex flex-col items-center mx-auto !h-[70vh]`}>
               <div
                  className={`!h-full relative group aspect-[5/3] z-10 overflow-hidden hover:opacity-90 transition-opacity duration-200 !max-w-[70vw]`}>
                  <div className={`absolute hidden top-3 left-3 group-hover:block`}>
                     {!!image.metadata?.aiGenerated && <AIGenerated />}
                  </div>
                  <ReportImageButton />
                  <Image
                     title={!!image.title?.length ? image.title : image.tags.filter(x => !!x.length).map(startCase).slice(0, 3).join(`, `)}
                     id={`image-${image.id}`}
                     data-src={isAbsoluteUrl(image?.absolute_url) ? image.absolute_url : path.join(`/uploads`, getFileName(image?.absolute_url)!).replaceAll(`\\`, `/`)}
                     layout="responsive"
                     className={`!object-cover !bg-center-center`}
                     width={600}
                     height={600}
                     src={isAbsoluteUrl(image?.absolute_url) ? image.absolute_url : path.join(`/uploads`, getFileName(image?.absolute_url)!).replaceAll(`\\`, `/`)}
                     alt={image.id} />
               </div>
            </div>
            <div className={`mt-4`}>
               <ImageDescription image={image} />
               <Suspense fallback={<Loader2 size={16} className={`animate-spin mr-2`} />}>
                  <ImageCommentsSection imageId={image.id} />
               </Suspense>
               <ImageTagsSection image={image} />
               <Suspense fallback={<HomeFeedSectionLoading cols={3} />}>
                  <RelatedImagesSection likedImageIds={likedImageIds} image={image} />
               </Suspense>
            </div>
         </div>
         <div className={`h-full relative`}>
            <ImageSummary
               haveIFollowed={haveIFollowed}
               haveISaved={haveISaved}
               haveIDownloaded={haveIDownloaded}
               haveILiked={haveILiked}
               image={image} />
         </div>
      </main>
   );
};

export default Page;
