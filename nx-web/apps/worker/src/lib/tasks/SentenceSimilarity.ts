import { HfInference } from "@huggingface/inference";
import {
   pipeline,
   dot,
   env,
} from "@xenova/transformers";
import * as path from "node:path";
import { __IS_DEV__ } from "@nx-web/shared";

global.self = global;

env.backends.onnx ??= { }
env.backends.onnx.wasm ??= { }
env.backends.onnx.wasm.numThreads = 1;

export interface SentenceSimilarityResponse {
   output: { label: string, score: number }[];
}

export class SentenceSimilarity {
   hf: HfInference;
   extractor?: any;

   constructor(public model: string) {
      if(__IS_DEV__) {
         env.allowLocalModels = true
         env.localModelPath = path.join(process.cwd(), `models`)
         env.allowRemoteModels = false;
      }

      this.hf = new HfInference(process.env.HF_API_KEY, {
         use_cache: true,
         dont_load_model: false,
         retry_on_error: true,
      });
   }

   public async run(source_sentences: ({ label: string, score: number })[], sentences: string[]):
      Promise<SentenceSimilarityResponse> {
      if (!this.extractor) {
         this.extractor = await pipeline(
            "feature-extraction",
            this.model ?? "Snowflake/snowflake-arctic-embed-s",
            {
               quantized: false, // Comment out this line to use the quantized version
            });
         console.log({ extractor: this.extractor });
      }

      const output = await this.extractor._call(
         [...source_sentences.map(x => x.label), ...sentences],
         {
            normalize: true, pooling: `cls`,
         });

      const embeddings = output!.tolist();

      const source_embeddings = embeddings.slice(0, source_sentences.length);
      const sentence_embeddings = embeddings.slice(source_sentences.length);

      // Compute the similarity scores for each source embedding:
      const scores: Record<string, number> = sentences.reduce((acc, curr) => {
         acc[curr] = 0;
         return acc;
      }, {});

      for (let i = 0; i < source_embeddings.length; i++) {
         let source_embedding = source_embeddings[i];

         const similarities = sentence_embeddings.map(x => dot(source_embedding, x));
         similarities.forEach((similarity, index) => {
            scores[sentences[index]] += similarity * source_sentences[i].score;
         });
      }

      return {
         output:
            Object
               .entries(scores)
               .map(([key, value]) => ({ label: key, score: value }))
               .sort((a, b) => b.score - a.score),
      };
   }
}
