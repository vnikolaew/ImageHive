import { Events, inngest } from "@web/lib/inngest";
import { validate as isValidUUID } from "uuid";
import { time } from "@web/app/api/utils";
import { xprisma } from "@nx-web/db";

const FUNCTION_ID = `image-removedFromCollection`;

const EVENT_NAME: keyof Events = `image/image.removedFromCollection`;

const POPULARITY_SCORE_KEY = `popularity_score`;

export const handleImageRemovedFromCollection = inngest.createFunction(
   { id: FUNCTION_ID, retries: 0 },
   { event: EVENT_NAME },
   async ({ event, step, attempt }) => {
      if (!isValidUUID(event.data.imageId)) {
         console.log(`Invalid image ID.`);
         return { success: false };
      }

      const { imageId } = event.data;
      if (!imageId.length) return { success: false };

      await time(async () => {
         // Update image `popularity_score` in DB:
         let image = await xprisma.image.findUnique({ where: { id: imageId }, select: { id: true, metadata: true } });
         if (!image) return;

         image = await xprisma.image.update(
            {
               where: { id: imageId },
               data: {
                  metadata: {
                     // @ts-ignore
                     ...(image.metadata ?? {}),
                     [POPULARITY_SCORE_KEY]: (image.metadata?.[POPULARITY_SCORE_KEY] ?? 0) - 0.7
                  },
               },
               select: { metadata: true, id: true },
            },
         );

         console.log(`Updated score for image ${image.id}. New score is: ${image.metadata[POPULARITY_SCORE_KEY].toFixed(2)}`);

      }, event.name);
      return { event, success: false };
   },
);
