import { NextRequest } from "next/server";
import { ImageHiveApiResponse } from "@web/lib/utils";
import { sleep } from "@utils";
import { getSimilarImages } from "@web/app/photos/[imageId]/_components/_queries";
import { xprisma } from "@nx-web/db";
import { Image } from "@prisma/client";

export async function GET(req: NextRequest) {
   await sleep(2_000);

   const page = !isNaN(Number(req.nextUrl.searchParams.get("page"))) ? Number(req.nextUrl.searchParams.get("page")) : 1;
   const imageId = req.nextUrl.searchParams.get("imageId");

   const image = await xprisma.image.findUnique({
      where: { id: imageId },
      select: { tags: true, id: true },
   });
   if(!image) return ImageHiveApiResponse.failure(`Image not found`)

   const images = await getSimilarImages(image as Image, page);
   console.log({ images, size: images.length });
   return ImageHiveApiResponse.success(images);
}
