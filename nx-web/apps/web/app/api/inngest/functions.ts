import { inngest } from "@web/lib/inngest";
import { ClassifyImagesWorker } from "../../../../edge-function/lib/ClassifyImagesWorker";
import { time } from "../utils";


export const classifyImage = inngest.createFunction(
   { id: "hello-world" },
   { event: "test/image.classify" },
   async ({ event, step, attempt }) => {
      if (attempt > 1) return { success: false };

      await step.sleep("wait-a-moment", "1s");
      const { imageId } = event.data;
      if (!imageId.length) return { success: false };

      const worker = new ClassifyImagesWorker();
      await time(() => new Promise(res => setTimeout(res, 2000)), event.name);

      return { event, success: false };
   },
);
