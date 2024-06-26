import path from "path";
import { ExternalToast } from "sonner";

export const APP_NAME = `ImageHive`;
export const APP_VERSION = `1.0.0`;

export const __IS_DEV__ = process.env.NODE_ENV === "development";

export const RESEND_ONBOARDING_EMAIL = `onboarding@resend.dev`

export const API_ROUTES = {
   FORGOT_PASSWORD: `/api/forgot`,
   RESET_PASSWORD: `/api/reset`,
   COLLECTIONS: `/api/collections`,
   COMMENTS: `/api/comments`,
} as const;

export const HTTP = {
   MEDIA_TYPES: {
      APPLICATION_JSON: `application/json`,
   },
};

export const TOASTS: Record<string, ExternalToast & { message: string }> = {
   FORGOT_PASSWORD: {
      message: `Password reset successful`,
      description: `You've successfully reset your password.`,
      duration: 3_000,
   },
   UPLOAD_SUCCESS: {
      message: `Image upload successful`,
      description: `You've successfully uploaded your media.`,
      className: ``,
      classNames: {
         title: `text-lg`,
         description: `text-md`,
      },
      duration: 10_000,
   },
   MANY_UPLOAD_SUCCESS: {
      message: `Image uploads successful`,
      description: `You've successfully uploaded your media.`,
      className: ``,
      classNames: {
         title: `text-lg`,
         description: `text-md`,
      },
      duration: 10_000,
   },
   UPDATE_IMAGE_SUCCESS: {
      message: `Image update successful`,
      description: `You've successfully updated your media.`,
      className: ``,
      classNames: {
         title: `text-lg`, description: `text-md`,
      },
      duration: 10_000,
   },
   DELETE_IMAGE_SUCCESS: {
      message: `Image removal successful`,
      description: `You've successfully deleted your media.`,
      className: ``,
      classNames: {
         title: `text-lg`, description: `text-md`,
      },
      duration: 10_000,
   },

   CREATE_COLLECTION_SUCCESS: {
      message: `Collection successfully created.`,
      description: `You've successfully created a new collection.`,
      className: ``,
      classNames: {
         title: `text-lg`, description: `text-md`,
      },
      duration: 10_000,
   },
   EDIT_COLLECTION_SUCCESS: {
      message: `Collection successfully edited.`,
      description: `You've successfully edited the collection.`,
      className: ``,
      classNames: {
         title: `text-lg`, description: `text-md`,
      },
      duration: 10_000,
   },
   DELETE_COLLECTION_SUCCESS: {
      message: `Collection successfully deleted.`,
      description: `You've successfully deleted the collection.`,
      className: ``,
      classNames: {
         title: `text-lg`, description: `text-md`,
      },
      duration: 10_000,
   },
   EDIT_PROFILE_SUCCESS: {
      message: `Profile successfully edited.`,
      description: `You've successfully edited your profile details.`,
      className: ``,
      classNames: {
         title: `text-lg`, description: `text-md`,
      },
      duration: 10_000,
   },
   CHANGE_PROFILE_PICTURE_SUCCESS: {
      message: `Profile picture changed.`,
      description: `You've successfully changed your profile picture.`,
      className: ``,
      classNames: {
         title: `text-lg`, description: `text-md`,
      },
      duration: 10_000,
   },
   CHANGE_COOKIE_PREFERENCES_SUCCESS: {
      message: `Cookie preferences saved.`,
      description: `You've successfully saved your cookies preferences.`,
      className: ``,
      classNames: {
         title: `text-lg`, description: `text-md`,
      },
      duration: 10_000,
   },
} as const;

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
export const PROFILE_PICS_DIR = path.join(process.cwd(), "public", "profile-pictures");
