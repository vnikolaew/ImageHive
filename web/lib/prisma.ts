import { PrismaClient } from "@prisma/client/edge";
import { __IS_DEV__ } from "@/lib/consts";
import bcrypt from "bcryptjs";

export const globalForPrisma = globalThis as unknown as {
   prisma: PrismaClient | undefined
};

export let prisma = globalForPrisma.prisma ?? new PrismaClient({
   log: [{ emit: `stdout`, level: `info` }],
   errorFormat: `pretty`,
   transactionOptions: { isolationLevel: `Serializable` },
}).$extends({
   query: {
      user: {
         $allOperations({ operation, query, model, args }) {
            if (["create", "update"].includes(operation) && args.data["password"]) {
               args.data["password"] = bcrypt.hashSync(args.data["password"], 10);
            }
            return query(args);
         },

      },
   },
});


if (__IS_DEV__) globalForPrisma.prisma = prisma;