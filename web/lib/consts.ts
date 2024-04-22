import { ToasterToast } from "@/components/ui/use-toast";
import path from "path";
import { ExternalToast } from "sonner";

export const APP_NAME = `ImageHive`;
export const APP_VERSION = `1.0.0`;

export const __IS_DEV__ = process.env.NODE_ENV === "development";

export const API_ROUTES = {
   FORGOT_PASSWORD: `/api/forgot`,
   RESET_PASSWORD: `/api/reset`,
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
} as const;

export const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
