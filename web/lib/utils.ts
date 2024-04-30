import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";
import { HTTP } from "@/lib/consts";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export interface ApiResponse<T> {
   success: boolean,
   message: string;
   data?: T,
}

export interface ActionApiResponse<T = unknown> {
   success: boolean,
   data?: T,
}

//@ts-ignore
export const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());


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

   static unauthenticated() {
      return this.failure(`Unauthenticated.`);
   }
}

function buildFormData(formData: FormData, data: any, parentKey?: string) {
   if (Array.isArray(data)) {
      data.forEach((el) => {
         buildFormData(formData, el, parentKey);
      });

   } else if (typeof data === "object" && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
         buildFormData(formData, (data)[key], parentKey ? `${parentKey}.${key}` : key);
      });

   } else {
      if (data === null) {
         return;
      }

      let value = typeof data === "boolean" || typeof data === "number" ? data.toString() : data;
      formData.append(parentKey as string, value);
   }
}

export function normalizeFormData(formData: any): any[] {
   const normalizedData: any = {};

   for (const key in formData) {
      const matches = key.match(/imageUploads\[(\d+)]\[([^\[\]]+)]/);
      if (matches) {
         const index = matches[1];
         const property = matches[2];
         if (!normalizedData.hasOwnProperty(index)) {
            normalizedData[index] = {};
         }
         if (property === "tags") {
            if (!normalizedData[index].hasOwnProperty(property)) {
               normalizedData[index][property] = [];
            }
            const tagIndex = parseInt(key.match(/\[(\d+)]$/)![1]!);
            normalizedData[index][property][tagIndex] = formData[key];
         } else {
            normalizedData[index][property] = formData[key];
         }
      }
   }

   return Object.values(normalizedData);
}

export const objectToFormData = function(obj: any, form: FormData, namespace: string) {

   const fd = form || new FormData();
   let formKey;

   for (const property in obj) {
      if (obj.hasOwnProperty(property)) {

         if (namespace) {
            formKey = `${namespace}[${property}]`;
         } else {
            formKey = property;
         }

         // if the property is an object, but not a File,
         // use recursivity.
         if (typeof obj[property] === "object" && !(obj[property] instanceof File)) {

            obj[property] = objectToFormData(obj[property], fd, formKey);

         } else {

            // if it's a string or a File object
            fd.append(formKey, obj[property]);
         }

      }
   }

   return fd;
};

export function getFileExtension(fileName: string) {
   const dotIndex = fileName.lastIndexOf(".");
   return dotIndex !== -1 ? fileName.substring(dotIndex + 1).trim() : "";
}

export function getFileName(fileName: string) {
   if (fileName?.includes(`\\`)) return fileName?.split(`\\`).at(-1)?.trim();
   return fileName?.split(`/`)?.at(-1)?.trim();
}


export function getSessionImageSrc(image: string) {
   if (!image?.length) return `/default-avatar.png`;
   return isAbsoluteUrl(image) ? image : path.join(`/profile-pictures`, getFileName(image) ?? ``).replaceAll(`\\`, `/`);
}


export async function sleep(duration: number) {
   return await new Promise(res => setTimeout(res, duration));
}

export function isAbsoluteUrl(url: string) {

   // Regular expression for absolute URL
   var absoluteUrlPattern = /^(?:https?:\/\/)?(?:\w+\.)+\w{2,}(?:\/.*)?$/;

   // Test the string against the pattern
   return absoluteUrlPattern.test(url);
}

export function downloadImage(image: HTMLImageElement, name: string) {
   const imgUrl = image.src;

   const a = document.createElement("a");

   a.href = imgUrl;
   a.download = name;
   a.click();

   a.remove();
}

export function calculateSHA256(data: string) {
   const hash = crypto.createHash("sha256");
   hash.update(data);
   return hash.digest("hex");
}

export async function getGravatarImageUrl(email: string) {
   let imageUrl: string = null!;

   const emailHash = calculateSHA256((email as string).trim().toLowerCase());
   const url = `https://bg.gravatar.com/${emailHash}.json`;
   const res = await fetch(url, {
      method: "GET",
      headers: {
         "Accept": HTTP.MEDIA_TYPES.APPLICATION_JSON,
      },
   });
   if (res.ok) {
      const body = await res.json();
      if (body[`entry`][`thumbnailUrl`]) imageUrl = body[`thumbnailUrl`];
      else if (!!body[`entry`][`photos`]?.length) {
         imageUrl = body[`entry`][`photos`][0].value;
      }

      if (imageUrl) {
         imageUrl = `${imageUrl}?s=640`;
      }
   }

   return imageUrl;
}

export function changeQsParam(key: string, value: any) {
   const url = new URL(window.location.href);
   const searchParams = url.searchParams;
   searchParams.set(key, String(value));

   url.search = searchParams.toString();
   window.location.href = url.toString();
}