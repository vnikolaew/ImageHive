import {
	dot
} from '@xenova/transformers';
import _ from 'lodash';


export interface SentenceSimilarityResponse {
	output: { label: string, score: number }[];
}

export class SentenceSimilarity {
	static MODEL = `@cf/baai/bge-large-en-v1.5`

	constructor(public env: Env) {
	}

	public async run(source_sentences: ({ label: string, score: number })[], sentences: string[]):
		Promise<SentenceSimilarityResponse> {
		const all = _.chunk(
			[...source_sentences.map(x => x.label), ...sentences]);

      const env = this.env;
      console.log({ env, keys: Object.keys(env).join(`, `) });
		const output = await Promise.all(
			all.map<Promise<{ shape: [number, number], data: number[][] }>>(sentences => {
				return env.AI.run(
					SentenceSimilarity.MODEL,
					{
						text: sentences
					}
				);
			})
		);

		const embeddings = output.flatMap(x => x.data);

		const source_embeddings = embeddings.slice(0, source_sentences.length);
		const sentence_embeddings = embeddings.slice(source_sentences.length);

		// Compute the similarity scores for each source embedding:
		const scores: Record<string, number> = sentences.reduce((acc, curr) => {
			acc[curr] = 0;
			return acc;
		}, {} as Record<string, number>);

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
					.sort((a, b) => b.score - a.score)
		};
	}
}
