import { performance } from "perf_hooks";

export async function time(func: () => Promise<any>, name: string) {
   const start = performance.now();
   const result = await func();
   const end = performance.now();

   const time = end - start > 1000
      ? `${((end - start) / 1000).toFixed(3)}s`
      : `${(end - start).toFixed(3)}ms`;

   console.log(`Time taken to execute '${name}' function: ${time}.`);
   return result;
}
