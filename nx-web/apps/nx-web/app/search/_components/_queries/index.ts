
export async function getSimilarTags(tag: string): Promise<any> {
   try {
      // const response = await new ImagesApi(new Configuration(
      //    {
      //       get basePath() {
      //          return process.env.BACKEND_API_URL;
      //       },
      //       fetchApi: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
      //    }))
      //    .getSimilarTagsImagesTagsSimilarTagGetRaw({ tag });
      // if (!response.raw.ok) return { similarTags: [] };

     return { similarTags: [] };
   } catch (err) {
      return { similarTags: [] };
   }
}
