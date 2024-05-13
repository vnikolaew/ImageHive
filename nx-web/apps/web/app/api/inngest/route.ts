import { serve } from "inngest/next";
import { inngest } from "@web/lib/inngest";
import { classifyImage } from "./functions";
import {
   handleImageAddedToCollection,
   handleImageCommented,
   handleImageDownloaded,
   handleImageLiked,
   handleImageUnliked,
   handleImageViewed,
   updatePopularityScores,
   handleImageRemovedFromCollection,
} from "./functions/images";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
   client: inngest,
   streaming: `allow`,
   functions:
      [classifyImage, handleImageLiked, handleImageUnliked, handleImageCommented, handleImageDownloaded, handleImageAddedToCollection, handleImageViewed, updatePopularityScores, handleImageRemovedFromCollection],
});
