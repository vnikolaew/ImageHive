import { CallbacksOptions } from "@auth/core/types";

type SessionParameter = Parameters<CallbacksOptions["session"]>[0]

export const session = async ({ session, token, user, ...rest }: SessionParameter) => {
      if (session && session.user) {
         //@ts-ignore
         (session.user as any).id = token.id;
      }
      return session;
   }
;