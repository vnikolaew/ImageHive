import { NextRequest } from "next/server";
import { xprisma } from "@nx-web/db";
import { ImageHiveApiResponse } from "@web/lib/utils";
import { getUserHomeFeed } from "@web/app/_queries";
import { sleep } from "@utils";

export async function GET(req: NextRequest) {
   await sleep(2_000)
   const page = !isNaN(Number(req.nextUrl.searchParams.get("page"))) ? Number(req.nextUrl.searchParams.get("page")) : 1;
   const limit = !isNaN(Number(req.nextUrl.searchParams.get("limit"))) ? Number(req.nextUrl.searchParams.get("limit")) : 20;
   const order = (req.nextUrl.searchParams.get("order") ?? `Latest`)

   const [images, total] = await Promise.all([
      getUserHomeFeed(order, false, page, limit),
      xprisma.image.count(),
   ]);

   return ImageHiveApiResponse.success({ images, total, hasMore: page * limit < total });
}
