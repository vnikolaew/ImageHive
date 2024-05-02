"use client";
import React from "react";
import { useQsCollectionTab } from "@/hooks/useQueryString";
import { CollectionGridColumnImage } from "@/app/account/collections/[collectionId]/_components/CollectionGridColumn";
import { useSession } from "next-auth/react";
import { ImageDownloadItem } from "@/app/account/collections/_queries";

export interface UserDownloadsHistoryProps {
   downloads: ImageDownloadItem[]
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