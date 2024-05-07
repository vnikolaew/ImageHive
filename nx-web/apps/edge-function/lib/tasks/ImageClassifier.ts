import { HfInference } from "@huggingface/inference";


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

   public async classify(imagePath: string): Promise<ImageClassifierResponse> {
      const res = await this.hf
         .imageClassification({
            model: this.model,
            // data: fs.readFileSync(imagePath).buffer,
            data: await fetch(imagePath).then(res => res.blob())
         });

      return { output: res };
   }
}
