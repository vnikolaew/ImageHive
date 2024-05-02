import { Prisma, PrismaClient, Tag } from "@prisma/client";
import { Job, Worker } from "bullmq";
import { HfInference } from "@huggingface/inference";
import * as fs from "node:fs";
import _ from "lodash";
import {
   FeatureExtractionPipeline,
   pipeline,
} from "@xenova/transformers";
import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { CATEGORIES } from "./CATEGORIES";
import { xprisma } from "@nx-web/db";

type JobMessage = { imageId?: string }

export class ClassifyImagesWorker {
   inner: Worker;
   hf: HfInference;
   ss_model?: FeatureExtractionPipeline;
   hfi_model?: HuggingFaceInferenceEmbeddings;
   vectorStore: PrismaVectorStore<Tag, string, any, any>;

   static REDIS_CONNECTION = {
      host: `localhost`,
      port: 6379,
   };

   static IMAGE_CLASSIFICATION_MODEL = `openai/clip-vit-large-patch14`;
   static EMBEDDINGS_MODEL = "sentence-transformers/multi-qa-MiniLM-L6-cos-v1";

   constructor() {
      this.hf = new HfInference(`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`, {
         use_cache: true,
         dont_load_model: false,
         retry_on_error: true,
      });
      this.hfi_model = new HuggingFaceInferenceEmbeddings({
         model: `Snowflake/snowflake-arctic-embed-s`,
         apiKey: `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`,
      });

      this.vectorStore = PrismaVectorStore.withModel<Tag>(xprisma).create(
         this.hfi_model,
         {
            prisma: Prisma,
            tableName: `Tag`,
            vectorColumnName: `embedding`,
            columns: {
               name: PrismaVectorStore.IdColumn,
               embedding: PrismaVectorStore.ContentColumn
            },
         },
      );

      this.inner = new Worker<JobMessage>(
         "classify_images",
         job => this.process(job),
         { name: `worker-1`, connection: ClassifyImagesWorker.REDIS_CONNECTION, concurrency: 3, autorun: false });

      this.inner.on(`ready`, () => {
         console.log(`Worker is ready and listening for messages.`);
      });
      this.inner.on("completed", job => {
         console.log(`Job ${job.id} has completed!`);
      });

      this.inner.on("failed", (job, err) => {
         console.log(`Job ${job?.id} has failed with ${err.message}`);
      });

      this.inner.on("error", err => {
         console.error(err);
      });
   }

   async run() {
      this.ss_model = await pipeline(`feature-extraction`, `Snowflake/snowflake-arctic-embed-s`, {
         quantized: false,
      });
      console.log(`Loaded feature extraction model.`);
      // const ss_model2 = await AutoModel.from_pretrained(ClassifyImagesWorker.EMBEDDINGS_MODEL);

      await this.inner.run();
   }

   async disconnect() {
      await this.inner.disconnect();
   }

   private async process(job: Job<JobMessage>) {
      if (!job.data.imageId?.length) return;

      const image = await new PrismaClient().image.findUnique({
         where: { id: job.data.imageId },
      });
      if (!image) {
         console.log(`Image with ID ${job.data.imageId} not found 1!`);
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

      const predictions = _.concat(res, res2).sort(({ score }, { score: scoreB }) => scoreB - score);
      const result = await this.ss_model?._call(predictions.map(p => p.label), { normalize: true, pooling: `cls` });

      console.log({ predictions, result: result!.tolist() });
      const tags = _.zip(predictions, result!.tolist() as unknown as any[])
         .map(([a, b]) => ({ name: a?.label, embedding: (b as any[]).slice(0, 384) }));

      // Insert embeddings in DB:
      for (const tag of tags) {
         const ex = await xprisma.tag.findUnique({
            where: { name: tag.name },
            select: { name: true },
         });

         if (!ex) {
            await this.vectorStore.addModels(
               await xprisma.$transaction([tag].map(tag => xprisma.tag.create({ data: { name: tag.name } }))),
            );

            // if (affected === 1) console.log(`Inserted ne w tag!`);
         }
         // if (ex) await this.prisma.tag.update({ where: { name: ex.name }, data: { embedding: tag.embedding } });
      }
   }
}
