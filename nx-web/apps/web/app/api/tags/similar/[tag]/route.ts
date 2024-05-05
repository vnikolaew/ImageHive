"use server";

import { NextRequest } from "next/server";
import { ImageHiveApiResponse } from "@web/lib/utils";

export async function GET(req: NextRequest,
                          { params }: { params: { tag: string } },
) {
   const { tag } = params;
   // const response = await new ImagesApi(new Configuration({
   //    get basePath(): string {
   //       return process.env.BACKEND_API_URL!;
   //    },
   // }))
   //    .getSimilarTagsImagesTagsSimilarTagGetRaw({ tag });
   // if(!response.raw.ok) return ImageHiveApiResponse.failure(``);

   return ImageHiveApiResponse.json({ })
}
