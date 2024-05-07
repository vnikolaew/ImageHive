import { HfInference } from "@huggingface/inference";
import { sleep } from "@utils";

export interface SentenceSimilarityResponse {
   output: { label: string, score: number }[];
}

export class SentenceSimilarity {
   hf: HfInference;
   extractor?: any;

   constructor(public model: string) {
      this.hf = new HfInference(process.env.HF_API_KEY, {
         use_cache: true,
         dont_load_model: false,
         retry_on_error: true,
      });
   }

   public async run(source_sentences: ({ label: string, score: number })[], sentences: string[]):
      Promise<SentenceSimilarityResponse> {
      console.log({ source_sentences, sentences });

      const similarities = await Promise.all(
         source_sentences.map((s, index) => {
            // Add a delay to evade rate limit:
            return sleep(index * 500)
               .then(() =>
                  this.hf.sentenceSimilarity({
                     model: this.model ?? "Snowflake/snowflake-arctic-embed-s",
                     inputs: {
                        source_sentence: s.label,
                        sentences,
                     },
                  }));
         }),
      );
      console.log({ size: similarities.length, similarities });

      // Compute a normalized similarity score for each source embedding:
      const scores: Record<string, number> = sentences.reduce((acc, curr) => {
         acc[curr] = 0;
         return acc;
      }, {});

      for (let i = 0; i < similarities.length; i++) {
         let similarity = similarities[i];
         for (let s_score of similarity) {
            scores[sentences[i]] += s_score * source_sentences[i].score;
         }
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
