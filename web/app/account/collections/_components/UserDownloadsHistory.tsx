"use client";
import React from "react";
import { auth } from "@/auth";
import { useQsCollectionTab } from "@/hooks/useQsImageId";
import { ImageDownload, Image } from "@prisma/client";

export interface UserDownloadsHistoryProps {
   open?: boolean,
   downloads: (ImageDownload & { image: Image })[],
}

const UserDownloadsHistory = ({ downloads }: UserDownloadsHistoryProps) => {
   const [selectedTab, setSelectedTab] = useQsCollectionTab();
   if (selectedTab !== `downloads`) return null;

   return (
      <div className={`grid gap-4`}>
         {downloads.map((download, i) => (
            <div key={i}>{download.image.absolute_url}</div>
         ))}
      </div>
   );
};

export default UserDownloadsHistory;