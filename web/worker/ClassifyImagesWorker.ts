import { PrismaClient } from "@prisma/client";
import { Job, Worker } from "bullmq";
import { HfInference } from "@huggingface/inference";
import * as fs from "node:fs";

const CATEGORIES = [
   "nature",
   "landscape",
   "people",
   "animals",
   "food",
   "travel",
   "architecture",
   "city",
   "business",
   "technology",
   "art",
   "health",
   "fitness",
   "sports",
   "music",
   "education",
   "science",
   "history",
   "culture",
   "religion",
   "fashion",
   "beauty",
   "home",
   "family",
   "friends",
   "love",
   "celebration",
   "holiday",
   "party",
   "wedding",
   "baby",
   "childhood",
   "teenager",
   "adult",
   "elderly",
   "community",
   "environment",
   "pollution",
   "climate change",
   "recycling",
   "green living",
   "equality",
   "justice",
   "freedom",
   "peace",
   "happiness",
   "success",
   "challenge",
   "adventure",
   "discovery",
   "creativity",
   "innovation",
   "inspiration",
   "motivation",
   "ambition",
   "dream",
   "goal",
   "progress",
   "change",
   "transformation",
   "reflection",
   "self-improvement",
   "mindfulness",
   "meditation",
   "yoga",
   "spirituality",
   "faith",
   "beliefs",
   "philosophy",
   "literature",
   "writing",
   "reading",
   "books",
   "film",
   "music",
   "art",
   "painting",
   "sculpture",
   "photography",
   "design",
   "fashion",
   "architecture",
   "technology",
   "science fiction",
   "fantasy",
   "mystery",
   "thriller",
   "horror",
   "romance",
   "comedy",
   "drama",
   "action",
   "adventure",
   "documentary",
   "biography",
];

export class ClassifyImagesWorker {
   inner: Worker;
   hf: HfInference;

   static REDIS_CONNECTION = {
      host: `localhost`,
      port: 6379,
   };

   static IMAGE_CLASSIFICATION_MODEL = `openai/clip-vit-large-patch14`;

   constructor() {
      this.hf = new HfInference(`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`, {
         use_cache: true,
         dont_load_model: false,
         retry_on_error: true,
      });

      this.inner = new Worker(
         "classify_images",
         job => this.process(job),
         { name: `worker-1`, connection: ClassifyImagesWorker.REDIS_CONNECTION, concurrency: 3, autorun: false });

      this.inner.on("completed", job => {
         console.log(`Job ${job.id} has completed!`);
      });

      this.inner.on("failed", (job, err) => {
         console.log(`Job ${job?.id} has failed with ${err.message}`);
      });

      this.inner.on("error", err => {
         // log the error
         console.error(err);
      });
   }

   async run() {
      await this.inner.run();
   }

   async disconnect() {
      await this.inner.disconnect();
   }

   private async process(job: Job) {
      if (!job.data.imageId) return;

      const image = await new PrismaClient().image.findUnique({
         where: { id: job.data.imageId },
      });
      if (!image) {
         console.log(`Image with ID ${job.data.imageId} not found!`);
         return;
      }

      console.log({ image });

      const [res, res2] = await Promise.all([
         this.hf.zeroShotImageClassification({
            model: ClassifyImagesWorker.IMAGE_CLASSIFICATION_MODEL,
            inputs: {
               image: fs.readFileSync(image.absolute_url).buffer,
            },
            parameters: {
               candidate_labels: CATEGORIES.slice(0, 10),
            },
         }),
         this.hf.zeroShotImageClassification({
            model: ClassifyImagesWorker.IMAGE_CLASSIFICATION_MODEL,
            inputs: {
               image: fs.readFileSync(image.absolute_url).buffer,
            },
            parameters: {
               candidate_labels: image.tags,
            },
         }),
      ]);

      console.log({ res: res.slice(0 , 5), res2: res2.slice(0, 5) });
   }
}