import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import path from "path";

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
  const absoluteUrlPattern = /^(?:https?:\/\/)?(?:\w+\.)+\w{2,}(?:\/.*)?$/;

  // Test the string against the pattern
  return absoluteUrlPattern.test(url);
}

