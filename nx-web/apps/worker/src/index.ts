import { ImageClassifier } from './lib/tasks/ImageClassifier';
import { SentenceSimilarity } from './lib/tasks/SentenceSimilarity';
import { Categories } from './lib/categories';
import type { ExecutionContext } from "@cloudflare/workers-types"
const MODEL = `google/vit-base-patch16-224`;

const URL_IGNORE_PATTERNS = [`favicon.ico`];

const DEFAULT_TOP_K = 5;

export default {
   async fetch(request: Request, env: Env, _: ExecutionContext): Promise<Response> {
      const url = new URL(request.url);
      if (URL_IGNORE_PATTERNS.some(p => url.pathname.includes(p))) return new Response();

      if (!url.searchParams.has(`imageUrl`)) return new Response();

      // @ts-ignore
      const imageUrlParsed = URL.parse(url.searchParams.get(`imageUrl`)!);
      const topK = !isNaN(Number(url.searchParams.get(`top`)))
         ? Number(url.searchParams.get(`top`))
         : DEFAULT_TOP_K;

      if (!imageUrlParsed) return new Response();

      const sentenceSimilarity = new SentenceSimilarity(env);
      const classifier = new ImageClassifier(MODEL, env.HF_API_KEY);

      const res = await classifier.classify(imageUrlParsed.toString());
      const normalized = res.output
         .flatMap(({ label, score }) =>
            label.split(`,`)
               .map(x => x.trim())
               .map(label => ({ label, score })));

      const ss = await sentenceSimilarity.run(normalized, Categories);
      const tags = ss.output.slice(0, topK);

      return Response.json({ tags }, {
         headers: {
            'Content-Type': 'application/json',
         }
      });
   }
}
