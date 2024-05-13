-- CreateTable
CREATE TABLE "UserReport" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "reason" TEXT NOT NULL,
    "contentUrl" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "issue_screenshot_absolute_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB DEFAULT 'null',

    CONSTRAINT "UserReport_pkey" PRIMARY KEY ("id")
);
