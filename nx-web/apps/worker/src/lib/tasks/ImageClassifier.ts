import { HfInference } from "@huggingface/inference";
import fs from "node:fs";
import fetch from "node-fetch";


export interface ImageClassifierResponse {
   output: { label: string, score: number }[];
}

export class ImageClassifier {
   hf: HfInference;

   constructor(public model: string) {
      this.hf = new HfInference(process.env.HF_API_KEY, {
         use_cache: true,
         dont_load_model: false,
         retry_on_error: true,
      });

   }

   private isHttpURL(str) {
      // Regular expression to match HTTP URL
      const httpPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

      // Test the string against the pattern
      return httpPattern.test(str);
   }

   public async classify(imagePath: string): Promise<ImageClassifierResponse> {
      const res = await this.hf
         .imageClassification({
            model: this.model,
            data: this.isHttpURL(imagePath) ? await fetch(imagePath).then(r => r.blob()) : fs.readFileSync(imagePath).buffer,
         });

      return { output: res };
   }
}
