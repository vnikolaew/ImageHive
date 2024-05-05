"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useQsCollectionTab } from "@web/hooks/useQueryString";
import { ImageDownloadItem } from "@web/app/account/collections/_queries";
import {
  CollectionGridColumnImage
} from "@web/app/account/collections/[collectionId]/_components/CollectionGridColumn";

export interface UserDownloadsHistoryProps {
   downloads: ImageDownloadItem[]
   likedImages: Set<string>
}

const UserDownloadsHistory = ({ downloads, likedImages }: UserDownloadsHistoryProps) => {
   const [selectedTab] = useQsCollectionTab();
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
