import { NextResponse } from "next/server";
import { xprisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import path from "path";
import { getFileName } from "@/lib/utils";
import * as fs from "node:fs";
import { ReadableOptions } from "node:stream";
import { NextApiRequest } from "next";
import { Stats } from "node:fs";
import { constants } from "node:http2";
import mime from "mime";

type Context = { params: { imageId: string } };

/**
 * Return a stream from the disk
 * @param {string} path - The location of the file
 * @param {ReadableOptions} options - The streamable options for the stream (ie how big are the chunks, start, end, etc).
 * @returns {ReadableStream} A readable stream of the file
 */
function streamFile(path: string, options?: ReadableOptions): ReadableStream<Uint8Array> {
   const downloadStream = fs.createReadStream(path, options);

   return new ReadableStream({
      start(controller) {
         downloadStream.on("data", (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)));
         downloadStream.on("end", () => controller.close());
         downloadStream.on("error", (error: NodeJS.ErrnoException) => controller.error(error));
      },
      cancel() {
         downloadStream.destroy();
      },
   });
}

export async function GET(req: NextApiRequest, ctx: Context): Promise<any> {
   const { imageId } = ctx.params;

   const image = await xprisma.image.findUnique({
      where: { id: imageId },
   });

   console.log(process.cwd());
   if (!image) return notFound();

   const fullFilePath = path.join(process.cwd(), `public`, `uploads`, getFileName(image.absolute_url)!);
   if (!fs.existsSync(fullFilePath)) return new NextResponse(null!, {
      status: constants.HTTP_STATUS_NOT_FOUND,
      headers: new Headers({}),
   });

   const stats: Stats = await fs.promises.stat(fullFilePath);
   const data: ReadableStream<Uint8Array> = streamFile(fullFilePath);
   const res = new NextResponse(data, {
      status: 200,
      headers: new Headers({
         "Content-type": mime.getType(image.file_format) ?? `image/png`,
         "Content-length": stats.size.toString(),
         'Cache-Control': `public, max-age=${60 * 60 * 24}, must-revalidate`,
      }),
   });

   return res;
}