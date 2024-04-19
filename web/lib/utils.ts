import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";
import { constants } from "node:http2";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export interface ApiResponse<T> {
   success: boolean,
   message: string;
   data: T,
}

export class ImageHiveApiResponse<Body = unknown> extends NextResponse<Body> {

   static badRequest<JsonBody>(body: JsonBody, init?: ResponseInit): ImageHiveApiResponse<JsonBody> {
      return ImageHiveApiResponse.json(body, { status: 404, ...init });
   }

   static success<JsonBody>(body: JsonBody, init?: ResponseInit): ImageHiveApiResponse<ApiResponse<JsonBody>> {
      return ImageHiveApiResponse.json({
         success: true,
         message: `Success.`,
         data: body,
      }, { status: 200, ...init });
   }

   static failure<JsonBody>(message: string, init?: ResponseInit): ImageHiveApiResponse<ApiResponse<JsonBody>> {
      return ImageHiveApiResponse.json({
         success: false,
         message,
         data: null!,
      }, { status: 404, ...init });
   }
}