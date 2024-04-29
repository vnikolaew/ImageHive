"use server";

import { NextRequest } from "next/server";
import { Configuration, ImagesApi } from "@/lib/api";
import { ImageHiveApiResponse } from "@/lib/utils";

export async function GET(req: NextRequest,
                          { params }: { params: { tag: string } },
) {
   const { tag } = params;
   const response = await new ImagesApi(new Configuration({
      get basePath(): string {
         return process.env.BACKEND_API_URL!;
      },
   }))
      .getSimilarTagsImagesTagsSimilarTagGetRaw({ tag });
   if(!response.raw.ok) return ImageHiveApiResponse.failure(``);

   return ImageHiveApiResponse.json(await response.value())
}