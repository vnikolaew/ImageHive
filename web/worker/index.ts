import readline from "readline/promises";
import { ClassifyImagesWorker } from "./ClassifyImagesWorker";

async function main() {
   const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
   });
   const worker = new ClassifyImagesWorker()

   process.on(`SIGINT`, () => {
      worker.disconnect();
      process.exit(1)
   });
   process.on(`exit`, () => {
      worker.disconnect();
      process.exit(1)
   });
   process.on(`SIGTERM`, () => {
      worker.disconnect();
      process.exit(1)
   });

   while (true) {
      await worker.run()
      const text = await rl.question(``);
   }
}


main().catch((err) => {
   console.log(err);
   process.exit(1);
});