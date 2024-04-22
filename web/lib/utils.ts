import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextResponse } from "next/server";

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
