import { HfInference } from "@huggingface/inference";
import _ from "lodash";
import path from "path";
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

class HuggingFaceInference {
   hf: HfInference;

   static SS_MODEL = `sentence-transformers/all-MiniLM-L6-v2`;
   static IMAGE_CLASSIFICATION_MODEL = `openai/clip-vit-large-patch14`;
   static IMAGE_CLASSIFICATION_MODEL2 = `google/vit-base-patch16-224`;
   static IMAGE_CAPTIONING_MODEL = "nlpconnect/vit-gpt2-image-captioning";
   static IMAGE_SEGMENTATION_MODEL = "facebook/detr-resnet-50-panoptic";

   static OBJECT_DETECTION_MODEL = "facebook/detr-resnet-50";

   static IMAGES_DIR = path.join(process.cwd(), "public", `uploads`);

   constructor() {
      this.hf = new HfInference(`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`, {
         use_cache: true,
         dont_load_model: false,
         retry_on_error: true,
      });
   }

   async sentence_similarity(source_sentence: string, model?: string) {
      const result = await this.hf.sentenceSimilarity({
         model: model ?? HuggingFaceInference.SS_MODEL,
         inputs: {
            source_sentence,
            sentences: CATEGORIES,
         },
      }, {
         use_cache: true,
      });

      console.log(`Original sentence: ${source_sentence}`);
      console.log(_.zip(result, CATEGORIES).sort((a, b) => b[0]! - a[0]!).slice(0, 10));
   }

   async zeroShotClassification(sentence: string) {
      const result = await this.hf.zeroShotClassification({
         inputs: sentence,
         parameters: {
            candidate_labels: CATEGORIES.slice(0, 10),
         },
         model: `facebook/bart-large-mnli`,
      });

      console.log(_.zip(result[0].labels, result[0].scores)
         .sort((a, b) => b[1]! - a[1]!).slice(0, 10));
      return result;
   }

   async object_detection(imagePath: string) {
      const result = await this.hf.objectDetection({
         data: fs.readFileSync(imagePath),
         model: HuggingFaceInference.OBJECT_DETECTION_MODEL,
      });

      console.log(result);
      return result;
   }

   async image_to_text(imagePath: string) {
      const result = await this.hf.imageToText({
         data: fs.readFileSync(imagePath),
         model: HuggingFaceInference.IMAGE_CAPTIONING_MODEL,
      });

      console.log(result);
      return result;
   }

   async image_classification(imagePath: string) {
      const result = await this.hf.zeroShotImageClassification({
         model: HuggingFaceInference.IMAGE_CLASSIFICATION_MODEL,
         inputs: {
            image: (fs.readFileSync(imagePath, {})).buffer,
         },
         parameters: {
            candidate_labels: CATEGORIES.slice(0, 10),
         },
      }, {
         use_cache: true,
      });

      const result2 = await this.hf.imageClassification({
         model: HuggingFaceInference.IMAGE_CLASSIFICATION_MODEL2,
         data: (fs.readFileSync(imagePath, {})).buffer,
      }, {
         use_cache: true,
      });

      console.log(result);
      console.log(result2);
      // console.log(_.zip(result, CATEGORIES).sort((a, b) => b[0]! - a[0]!).slice(0, 10));
   }

}

async function main() {
   const hf = new HuggingFaceInference();

   // await hf.sentence_similarity(source_sentence);
   const fileName = `1714109387820_4630a155-f4c5-4189-9f6c-b7198de1dc3c_pexels-photo-5428262.jpeg`;
   const image = path.join(HuggingFaceInference.IMAGES_DIR, fileName);

   await hf.image_classification(image);
   await hf.zeroShotClassification(`How do I become better at chess?`);

   // let result: any = await hf.image_segmentation(image);
   let result: any = await hf.object_detection(image);
   result = await hf.image_to_text(image);

   await hf.sentence_similarity(
      result.generated_text,
      `BAAI/bge-m3`,
   );
}

main().catch(console.error);