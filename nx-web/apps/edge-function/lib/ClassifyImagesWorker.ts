import { Prisma, PrismaClient, Tag } from "@prisma/client";
import { HfInference } from "@huggingface/inference";

import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
// @ts-ignore
import { Categories } from "./categories";
import { ImageClassifier } from "./tasks/ImageClassifier";
import { SentenceSimilarity } from "./tasks/SentenceSimilarity";

const prisma = new PrismaClient();

export class ClassifyImagesWorker {
   hf: HfInference;
   hfi_model?: HuggingFaceInferenceEmbeddings;
   vectorStore: PrismaVectorStore<Tag, string, any, any>;

   image_classifier: ImageClassifier;
   sentence_similarity: SentenceSimilarity;

   static IMAGE_CLASSIFICATION_MODEL = `google/vit-base-patch16-224`;
   static SS_MODEL = `Snowflake/snowflake-arctic-embed-s`;

   constructor() {
      // super(`classify_images`, `worker-1`);
      this.hf = new HfInference(process.env.HF_API_KEY, {
         use_cache: true,
         dont_load_model: false,
         retry_on_error: true,
      });
      this.hfi_model = new HuggingFaceInferenceEmbeddings({
         model: ClassifyImagesWorker.SS_MODEL,
         apiKey: process.env.HF_API_KEY,
      });

      this.image_classifier = new ImageClassifier(ClassifyImagesWorker.IMAGE_CLASSIFICATION_MODEL);
      this.sentence_similarity = new SentenceSimilarity(ClassifyImagesWorker.SS_MODEL);

      this.vectorStore = PrismaVectorStore.withModel<Tag>(prisma)
         .create(
            this.hfi_model,
            {
               prisma: Prisma,
               tableName: `Tag`,
               vectorColumnName: `embedding`,
               columns: {
                  name: PrismaVectorStore.ContentColumn,
                  id: PrismaVectorStore.IdColumn,
               },
            },
         );
   }

   public async process(imageId: string) {
      let image = await prisma.image.findUnique({
         where: { id: imageId },
      });

      // @ts-ignore
      if (image.metadata.classified === true) {
         console.log(`Image with ID ${imageId} is already classified.`);
         return;
      }

      if (!image) {
         console.log(`Image with ID ${imageId} not found!`);
         return;
      }

      console.log(`Image with ID ${imageId} found!`);

      const res = await this.image_classifier.classify(image.absolute_url);
      const normalized = res.output
         .flatMap(({ label, score }) =>
            label.split(`,`)
               .map(x => x.trim())
               .map(label => ({ label, score })));

      const ss = await this.sentence_similarity.run(normalized, Categories);

      const newTags = ss.output
         .slice(0, 5)
         .map(x => x.label);

      image = await prisma.image.update({
         where: { id: image.id },
         data: {
            tags: [...image.tags, ...newTags],
            metadata: { ...(image.metadata as Record<string, any> ?? {}), "classified": true },
         },
      });

      console.log(`New image tags: [${image.tags.join(`, `)}] `);

      await this.vectorStore.addModels(
         await prisma.$transaction(
            image.tags.map(t =>
               prisma.tag.upsert({
                  where: { name: t },
                  create: { name: t },
                  update: { name: t },
               })),
         ),
      );
   }
}
