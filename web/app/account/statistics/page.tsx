import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { xprisma } from "@/lib/prisma";
import { auth } from "@/auth";

export interface PageProps {
}

async function getStats() {
   const session = await auth();
   const userImages = await xprisma.image.findMany({
      where: {
         userId: session?.user?.id as string,
      },
      include: {
         _count: {
            select: {
               comments: true,
               likes: true,
               downloads: true,
               views: true
            },
         },
      },
   });

   const imageViews = userImages
      .map(i => i._count.views)
      .reduce((a, b) => a + b, 0);

   const imageLikes = userImages
      .map(i => i._count.likes)
      .reduce((a, b) => a + b, 0);

   const imageDownloads = userImages
      .map(i => i._count.downloads)
      .reduce((a, b) => a + b, 0);

   const imageComments = userImages
      .map(i => i._count.comments)
      .reduce((a, b) => a + b, 0);

   return { imageLikes, imageComments, imageDownloads , imageViews };
}

const Page = async ({}: PageProps) => {
   const { imageDownloads, imageComments, imageLikes, imageViews } = await getStats();

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