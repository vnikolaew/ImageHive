/* tslint:disable */
/* eslint-disable */
import { APP_NAME, APP_VERSION } from "@/lib/consts";
import { ImagesApi } from "@/lib/api/apis/ImagesApi";
import { Configuration } from "@/lib/api";

export * from "./DefaultApi";

export const imagesApi = new ImagesApi(new Configuration({
   get basePath(): string {
      return process.env.BACKEND_API_URL!;
   },
   headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'X-Client': `${APP_NAME}_Web_${APP_VERSION}`
   },
   fetchApi: (input, init) => fetch(input, {...init, next: {revalidate: 60}})
}));
