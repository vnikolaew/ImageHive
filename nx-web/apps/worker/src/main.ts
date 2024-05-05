import readline from "readline/promises";
import { ClassifyImagesWorker } from "./lib/ClassifyImagesWorker.js";

require('dotenv').config()

async function main() {
   const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  const worker = new ClassifyImagesWorker();

  process.on(`SIGINT`, () => {
    worker.disconnect();
    process.exit(1);
  });
  process.on(`exit`, () => {
    worker.disconnect();
    process.exit(1);
  });
  process.on(`SIGTERM`, () => {
    worker.disconnect();
    process.exit(1);
  });

  while (true) {
    try {
      await worker.run();
      let _ = await rl.question(``);
    } catch (error) {
      console.error(error);
    }
  }
}


main().catch((err) => {
  console.error(err);
  process.exit(1);
});
