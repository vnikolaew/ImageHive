import { PrismaClient } from "@prisma/client";
import { openverse_main } from "./openverse_seed";

const prisma = new PrismaClient();

async function main() {
   return openverse_main(prisma);
}

main()
   .then(async () => {
      await prisma.$disconnect();
      process.exit(0);
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });
