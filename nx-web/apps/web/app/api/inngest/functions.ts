import { inngest } from "@web/lib/inngest";
import { time } from "../utils";
import { ClassifyImagesWorker } from "../../../../worker/src/lib/ClassifyImagesWorker";
import { validate as isValidUUID } from "uuid";


export const classifyImage = inngest.createFunction(
   { id: "image-classify", retries: 0 },
   { event: "test/image.classify" },
   async ({ event, step, attempt }) => {
      if (!isValidUUID(event.data.imageId)) {
         console.log(`Invalid image ID.`);
         return { success: false };
      }

      await step.sleep("wait-a-moment", "1s");
      const { imageId } = event.data;

      if (!imageId.length) return { success: false };

      const worker = new ClassifyImagesWorker();
      await time(() => worker.processCore(imageId), event.name);

      return { event, success: false };
   },
);
