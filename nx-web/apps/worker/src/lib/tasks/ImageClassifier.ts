import { HfInference } from "@huggingface/inference";

export interface ImageClassifierResponse {
   output: { label: string, score: number }[];
}

export class ImageClassifier {
   hf: HfInference;

   constructor(public model: string, hfApiKey: string) {
      this.hf = new HfInference(hfApiKey, {
         use_cache: true,
         dont_load_model: false,
         retry_on_error: true,
      });

   }

   private isHttpURL(str: string) {
      // Regular expression to match HTTP URL
      const httpPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

      // Test the string against the pattern
      return httpPattern.test(str);
   }

   public async classify(imageUrl: string): Promise<ImageClassifierResponse> {
      console.log({ imageUrl});
      const res = await this.hf
         .imageClassification({
            model: this.model,
            data: await fetch(imageUrl).then(r => r.arrayBuffer())
         });

      return { output: res };
   }
}
