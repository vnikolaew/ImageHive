import { Configuration, ImagesApi, SimilarTagsResponse } from "@/lib/api";

export async function getSimilarTags(tag: string): Promise<SimilarTagsResponse> {
   try {
      const response = await new ImagesApi(new Configuration(
         {
            get basePath() {
               return process.env.BACKEND_API_URL;
            },
            fetchApi: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
         }))
         .getSimilarTagsImagesTagsSimilarTagGetRaw({ tag });
      if (!response.raw.ok) return { similarTags: [] };

      return await response.value();
   } catch (err) {
      return { similarTags: [] };
   }
}
