import { EventSchemas, Inngest } from "inngest";

type HelloWorld = {
   data: {
      email: string;
   };
};

type Timestamp = {
   data: {
      timestamp: number;
   };
};

type ClassifyImageRequest = {
   data: {
      imageId: string;
   };
};

type Events = {
   "test/hello.world": HelloWorld;
   "test/hello.inngest": Timestamp;
   "test/image.classify": ClassifyImageRequest;
};
// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app", schemas: new EventSchemas().fromRecord<Events>() });
