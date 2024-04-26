"use client";
import React from "react";
import { auth } from "@/auth";
import { useQsCollectionTab } from "@/hooks/useQsImageId";
import { ImageDownload, Image } from "@prisma/client";
import { CollectionGridColumnImage } from "@/app/account/collections/[collectionId]/_components/CollectionGridColumn";
import { useSession } from "next-auth/react";

export interface UserDownloadsHistoryProps {
   downloads: (ImageDownload & { image: Image })[],
   likedImages: Set<string>
}

const UserDownloadsHistory = ({ downloads, likedImages }: UserDownloadsHistoryProps) => {
   const [selectedTab, setSelectedTab] = useQsCollectionTab();
   const session = useSession();
   if (selectedTab !== `downloads`) return null;

   return (
      <div className={`grid grid-cols-4 gap-4`}>
         {downloads.map((download, i) => (
            <div key={i}>
               <CollectionGridColumnImage
                  haveILiked={likedImages.has(session.data?.user?.id!)}
                  collectionId={``}
                  image={download.image as any} />
            </div>
         ))}
      </div>
   );
};

export default UserDownloadsHistory;