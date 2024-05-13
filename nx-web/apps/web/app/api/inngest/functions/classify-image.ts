import { Events, inngest } from "@web/lib/inngest";
import { validate as isValidUUID } from "uuid";
import { xprisma } from "@nx-web/db";
import { time } from "@web/app/api/utils";


/**
 * The main function for executing image classification logic. It calls a Cloudflare Worker
 * that executes inference and then inserts the new tags into the database, as well as an
 * embeddings.
 * @param imageId
 */
async function classifyImageCore(imageId: string) {

   // 1. Fetch image from DB
   let image = await xprisma.image.findUnique({
      where: { id: imageId },
   });
   if (!imageId) return { success: false };

   console.log(`Image with ID ${imageId} was found: `, { image });


   // 2. Make a call to Cloudflare Worker for tags inference
   const response: { tags: { label: string, score: number }[] } = await fetch(
      `${process.env.IMAGE_CLASSIFIER_WORKER_URL}?imageUrl=${encodeURIComponent(image.absolute_url.trim())}&top=${10}`, {
         headers: {
            Accept: `application/json`,
         },
      }).then(res => res.json());

   console.log(`Response from CF worker: `, { tags: response.tags });

   // 3. Save tags to DB again as vector embeddings
   image = await xprisma.image.update({
      where: { id: image.id },
      data: {
         tags: [...image.tags, ...response.tags.map(t => t.label)],
         metadata: { ...(image.metadata as Record<string, any> ?? {}), "classified": true },
      },
   });

   await xprisma.tag.insertMany(image.tags);
}

const FUNCTION_ID = `image-classify`;

const EVENT_NAME: keyof Events = `image/image.classify`;

export const classifyImage = inngest.createFunction(
   { id: FUNCTION_ID, retries: 0 },
   { event: EVENT_NAME },
   async ({ event, step, attempt }) => {
      if (!isValidUUID(event.data.imageId)) {
         console.log(`Invalid image ID.`);
         return { success: false };
      }

      const { imageId } = event.data;
      if (!imageId.length) return { success: false };

      await time(() => classifyImageCore(imageId), event.name);
      return { event, success: false };
   },
);
