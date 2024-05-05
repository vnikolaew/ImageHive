import { NextRequest } from "next/server";
import { ImageComment } from "@prisma/client";
import { sleep } from "@nx-web/shared";
import { xprisma } from "@nx-web/db";
import { ImageHiveApiResponse } from "@web/lib/utils";

type Params = {
   imageId: string
}

export type ImageCommentsApiResponse = {
   imageComments: ImageComment[],
   page: number,
   limit: number
}

export async function GET(req: NextRequest, ctx: {
   params: Params
}): Promise<ImageHiveApiResponse<ImageCommentsApiResponse>> {
   await sleep(2000);
   const searchParams = req.nextUrl.searchParams;
   const { imageId } = ctx.params;

   const page = Number(searchParams.get("page") ?? 0);
   const limit = Number(searchParams.get("limit") ?? 10);

   const imageComments = await xprisma.imageComment.findMany({
      where: { imageId },
      orderBy: { createdAt: `desc` },
      include: {
         user: {
            select: { id: true, image: true, name: true },
         },
      },
      skip: (page) * limit,
      take: limit,
   });

   return ImageHiveApiResponse.json({ imageComments, page, limit });
}
