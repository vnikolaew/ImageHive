import { Job, Worker } from "bullmq";

export abstract class WorkerBase<TMessage> {
   protected inner: Worker;

   static REDIS_CONNECTION = {
      host: process.env.REDIS_HOST ?? `localhost`,
      port: parseInt(process.env.REDIS_PORT) ?? 6379,
   };

   protected constructor(queueName: string, workerName: string) {
      this.inner = new Worker<TMessage>(
         queueName,
         job => this.process.call(this, job),
         {
            name: workerName,
            connection: WorkerBase.REDIS_CONNECTION,
            concurrency: 3,
            autorun: false,
         });

      this.setupListeners();
   }

   async run() {
      await this.inner.run();
   }

   async disconnect() {
      await this.inner.disconnect();
   }

   protected setupListeners() {
      this.inner.on(`ready`, () => {
         console.log(`Worker is ready and listening for messages.`);
      });
      this.inner.on("completed", job => {
         console.log(`Job ${job.id} has completed!`);
      });

      this.inner.on("failed", (job, err) => {
         console.log(`Job ${job?.id} has failed with ${err.message}`);
      });

      this.inner.on("error", err => {
         console.error(err);
      });
   }

   protected abstract process(job: Job<TMessage, any, string>): Promise<any>;
}
