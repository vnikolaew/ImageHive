import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getStatistics } from "@/app/account/statistics/_queries";

export interface PageProps {
}

const Page = async ({}: PageProps) => {
   const { imageDownloads, imageComments, imageLikes, imageViews } = await getStatistics();

   const STATS: StatisticsCardProps[] = [
      {
         title: `Views`,
         counter: imageViews,
      },
      {
         title: `Downloads`,
         counter: imageDownloads,
      },
      {
         title: `Likes`,
         counter: imageLikes,
      },
      {
         title: `Comments`,
         counter: imageComments,
      },
   ];


   return (
      <div>
         <div className={`flex items-center gap-4 mt-8`}>
            {STATS.map((stat, index) => (
               <StatisticsCard key={index} title={stat.title} counter={stat.counter} />
            ))}
         </div>
      </div>
   );
};

export interface StatisticsCardProps {
   title: string;
   counter: number;
}

const StatisticsCard = ({ title, counter }: StatisticsCardProps) => {
   return (
      <Card className={`min-w-[200px] bg-muted`}>
         <CardHeader className={`!pb-1 !pt-4`}>{title}</CardHeader>
         <CardContent className={`text-xl font-semibold`}>{counter}</CardContent>
      </Card>
   );
};

export default Page;