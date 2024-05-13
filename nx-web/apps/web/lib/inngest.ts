import { EventSchemas, Inngest } from "inngest";

type Timestamp = {
   data: {
      timestamp: number;
   };
};

type BaseImageEvent<T = { }> = {
   data: T & {
      imageId: string;
      metadata?: Record<string, any>
   }
}

type ClassifyImageRequest = BaseImageEvent

type ImageLikedEvent = BaseImageEvent<{
   timestamp: number;
   userId: string;
}>

type ImageUnlikedEvent = ImageLikedEvent;
type ImageCommentedEvent = ImageLikedEvent;
type ImageDownloadedEvent = ImageLikedEvent;
type ImageAddedToCollectionEvent = BaseImageEvent<{
   collectionId: string, timestamp: number;
   userId: string;
}>;
type ImageRemovedFromCollectionEvent = ImageAddedToCollectionEvent;
type ImageViewedEvent = ImageLikedEvent;

export type ImageEvents = {
   "image/image.liked": ImageLikedEvent;
   "image/image.unliked": ImageUnlikedEvent;
   "image/image.commented": ImageCommentedEvent;
   "image/image.downloaded": ImageDownloadedEvent;
   "image/image.addedToCollection": ImageAddedToCollectionEvent;
   "image/image.removedFromCollection": ImageRemovedFromCollectionEvent;
   "image/image.viewed": ImageViewedEvent;
   "image/image.classify": ClassifyImageRequest;
}

export type Events = ImageEvents & {
   "test/hello.inngest": Timestamp;
};

// Create a client to send and receive events
export const inngest = new Inngest(
   {
      id: "my-app",
      schemas: new EventSchemas().fromRecord<Events>(),
      eventKey: process.env.INNGEST_EVENT_KEY,
   });
