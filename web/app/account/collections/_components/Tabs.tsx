"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export interface TabsProps {
   collectionsLength: number;
}

const CollectionTabs = ({ collectionsLength }: TabsProps) => {
   const [selectedTab, setSelectedTab] = useState(`collections`);

   return (
      <div className={`text-3xl flex items-center gap-4`}>
         <Button
            onClick={() => setSelectedTab(`collections`)}
            variant={selectedTab === `collections` ? `secondary` : `ghost`}
            size={`lg`}
                 className={`rounded-full gap-2`}>
            Collections
            <span className={`text-green-700`}>
                  {collectionsLength}
            </span>
         </Button>
         <Button
            onClick={() => setSelectedTab(`history`)}
            variant={selectedTab === `history` ? `secondary` : `ghost`}
            size={`lg`} className={`rounded-full gap-2`}>
            Download history
         </Button>

      </div>
   );
};

export default CollectionTabs;