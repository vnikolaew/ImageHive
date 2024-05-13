import React from "react";

import { notFound } from "next/navigation";
import { getUser } from "./_queries";
import { getImageSavesIds, getLikedImageIds } from "@web/app/_queries";
import UserProfileSection from "../_components/UserProfileSection";
import { APP_NAME, cn } from "@nx-web/shared";
import { GridColumn } from "@web/app/_components/GridColumn";
import { Button } from "@components/button";
import UserProfileCoverSection from "@web/app/users/[userId]/_components/UserProfileCoverSection";
import Link from "next/link";
import { Upload } from "lucide-react";
import { Metadata, ResolvingMetadata } from "next";
import { isCuid } from "@paralleldrive/cuid2";
import { xprisma } from "@nx-web/db";

export async function generateMetadata({ params }: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
   const { userId } = params;

   let parentMeta = await parent;
   if (!isCuid(userId)) return parentMeta;

   const user = await xprisma.user.findUnique({
      where: { id: userId },
      select: {
         image: true,
         name: true,
         id: true,
         profilePictureImageSrc: true,
      },
   });

   return {
      metadataBase: new URL(new URL(user.profilePictureImageSrc).origin),
      description: `User ${user.name}`,
      title: `${user.name} - ${APP_NAME}`,
      applicationName: APP_NAME,
      category: `users`,
      openGraph: {
         title: `${user.name} - ${APP_NAME}`,
         description: `User ${user.name}`,
         username: user.name,
         siteName: APP_NAME,
         images: [new URL(user.profilePictureImageSrc).href],
      },
      twitter: {
         images: [new URL(user.profilePictureImageSrc).href],
         site: `@site`,
      },
   };
}

export interface PageProps {
   params: { userId: string };
}

const Page = async ({ params: { userId } }: PageProps) => {
   const success = await getUser(userId);
   if (!success) return notFound();

   const { user, isMe, amIFollower } = success;

   const [likedImageIds, savedImageIds] = await Promise.all([
      getLikedImageIds(),
      getImageSavesIds(),
   ]);

   const columns = Array
      .from({ length: 4 })
      .map((_, i) => i)
      .map(x => user.images.filter((_, index) => index % 4 === x));

   return (
      <main className="flex min-h-screen flex-col items-center justify-start ">
         <UserProfileCoverSection isMe={isMe} coverImage={user.profile.cover_image} />
         <div className={`w-5/6 relative min-h-[60vh]`}>
            <UserProfileSection isMe={isMe} amIFollower={amIFollower} user={user} />
            <div className={`mt-12`}>
               <Button
                  size={`lg`}
                  variant={`secondary`}
                  className={cn(`gap-2 rounded-full !px-6 shadow-sm transition-colors duration-200`)}>Images</Button>

               <div className={`w-full mt-6 items-start gap-8 px-0`}>
                  {!user.images?.length && !isMe && (
                     <div className={`text-neutral-500`}>No images yet.</div>
                  )}
                  {!user.images?.length && isMe && (
                     <div className={`w-full flex flex-col items-center gap-2 justify-center`}>
                        <h2 className={`text-neutral-500 text-lg leading-tight`}>
                           You have no images yet.
                        </h2>
                        <Button size={`default`} asChild variant={`outline`}
                                className={`gap-3 !text-base rounded-lg shadow-md !px-10 !py-2 !h-fit leading-tight`}>
                           <Link href={`/upload`}>
                              <Upload size={16} />
                              Upload now
                           </Link>
                        </Button>
                     </div>
                  )}
               </div>
               <div className={`w-full mt-6 grid grid-cols-4 items-start gap-8 px-0`}>
                  {columns.map((column, index) => (
                     <GridColumn
                        savedImages={savedImageIds}
                        likedImageIds={likedImageIds}
                        key={index}
                        images={column} />
                  ))}
               </div>
            </div>
         </div>
      </main>
   );
};

export default Page;
