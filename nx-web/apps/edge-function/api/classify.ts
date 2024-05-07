import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ClassifyImagesWorker } from "../lib/ClassifyImagesWorker";
import dotenv from "dotenv";

export const runtime = 'edge';

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export default async function handler(req: VercelRequest, res: VercelResponse) {
   dotenv.config();

   if (typeof globalThis.EdgeRuntime === "string") {
      console.log(`Running in Edge`);
   }

   const { imageId = "" } = req.query;
   if (typeof imageId !== `string`) {
      return res.json({
         message: `Invalid 'imageId' query string.`,
      });
   }
   const worker = new ClassifyImagesWorker();
   await worker.process(imageId);

   return res.json({
      ok: true,
   });
}
