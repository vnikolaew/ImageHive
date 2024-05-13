"use client";
import React from "react";
import { useQsCollectionTab } from "@web/hooks/useQueryString";
import { Button } from "@components/button";

export interface TabsProps {
   collectionsLength: number;
}

const CollectionTabs = ({ collectionsLength }: TabsProps) => {
   const [selectedTab, setSelectedTab] = useQsCollectionTab()

   return (
      <div className={`text-3xl flex items-center gap-4`}>
         <Button
            onClick={() => setSelectedTab(`collections`)}
            variant={selectedTab === `collections` ? `secondary` : `ghost`}
            size={`lg`}
                 className={`rounded-full gap-2`}>
            Collections
            <span className={`text-primary`}>
               {collectionsLength}
            </span>
         </Button>
         <Button
            onClick={() => setSelectedTab(`downloads`)}
            variant={selectedTab === `downloads` ? `secondary` : `ghost`}
            size={`lg`} className={`rounded-full gap-2`}>
            Download history
         </Button>

      </div>
   );
};

export default CollectionTabs;
