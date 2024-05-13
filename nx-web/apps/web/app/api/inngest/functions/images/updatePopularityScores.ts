import { inngest } from "@web/lib/inngest";
import { xprisma } from "@nx-web/db";

const FUNCTION_ID = `image-updatePopularityScores`;

const POPULARITY_SCORE_KEY = `popularity_score`;

const CRON_EXPRESSION = `0 * * * *`;

export const updatePopularityScores = inngest.createFunction({ id: FUNCTION_ID, retries: 0 },
   { cron: CRON_EXPRESSION },
   async ({ step }) => {
      const images = await step.run(
         `load-images`,
         async () => {
            const images = await xprisma.$queryRaw<{ id: string; feed_score: number, metadata: Record<string, any> }[]>`
               SELECT id,
                      metadata,
                      COALESCE(il.likes * 1.0, 0)
                         + COALESCE(ic.comments * 1.2, 0)
                         + COALESCE(id.downloads * 1.5, 0)
                         + COALESCE(icc.collections * 0.7, 0) +
                      COALESCE(vc.views * 0.4, 0)
                         as feed_score
               FROM "Image"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS likes
                                  FROM "ImageLike"
                                  GROUP BY "imageId") AS il ON "Image".id = il."imageId"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS comments
                                  FROM "ImageComment"
                                  GROUP BY "imageId") ic ON "Image".id = ic."imageId"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS downloads
                                  FROM "ImageDownload"
                                  GROUP BY "imageId") id ON "Image".id = id."imageId"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS collections
                                  FROM "CollectionImage"
                                  GROUP BY "imageId") icc ON "Image".id = icc."imageId"
                       LEFT JOIN (SELECT "imageId",
                                         COUNT(*) AS views
                                  FROM "ImageView"
                                  GROUP BY "imageId") vc ON "Image".id = vc."imageId"
               ORDER BY feed_score DESC, "createdAt" DESC;
            `;

            return images;
         },
      );

      await step.run(
         `update-images`,
         async () => {
            const tasks = images.map(({ feed_score, id, metadata }) => {
               return xprisma.image.update({
                  where: { id },
                  // @ts-ignore
                  data: { metadata: { ...metadata, [POPULARITY_SCORE_KEY]: feed_score } },
               });
            });
            await Promise.all(tasks);
         },
      );

      return { success: false };
   },
);
