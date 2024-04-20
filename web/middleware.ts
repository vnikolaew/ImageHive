import { NextResponse } from "next/server";
import type { NextMiddleware } from "next/server";
import { auth } from "@/auth";

export const runtime=  `node.js`

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware

export function chain(
   functions: MiddlewareFactory[],
   index = 0,
): NextMiddleware {
   const current = functions[index];

   if (current) {
      const next = chain(functions, index + 1);
      return current(next);
   }

   return () => NextResponse.next();
}

export const urlMiddleware: MiddlewareFactory = (next: NextMiddleware) => {
   return (req, evt) => {
      req.headers.append("next-url", req.url);
      // res.headers.set("next-url", req.nextUrl);

      return next(req, evt);
   };
};

export const middleware = auth;
