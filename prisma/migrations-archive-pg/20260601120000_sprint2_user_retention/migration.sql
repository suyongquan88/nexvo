-- Sprint 2: replace MVP placeholder tables with visitor retention schema

-- DropEnum
DROP TYPE IF EXISTS "public"."Locale" CASCADE;
DROP TYPE IF EXISTS "public"."FavoriteSource" CASCADE;

-- DropTable (legacy MVP placeholders)
DROP TABLE IF EXISTS "public"."Feedback" CASCADE;
DROP TABLE IF EXISTS "public"."PurchaseProof" CASCADE;
DROP TABLE IF EXISTS "public"."Recommendation" CASCADE;
DROP TABLE IF EXISTS "public"."User" CASCADE;

-- CreateEnum
CREATE TYPE "public"."Locale" AS ENUM ('en', 'zh');
CREATE TYPE "public"."FavoriteSource" AS ENUM ('recommendation', 'manual');

-- CreateTable
CREATE TABLE "public"."VisitorSession" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "locale" "public"."Locale" NOT NULL DEFAULT 'en',
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SearchHistory" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "locale" "public"."Locale" NOT NULL,
    "answerPreview" TEXT,
    "snapshot" JSONB NOT NULL,
    "model" TEXT,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Favorite" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "searchKeyword" TEXT NOT NULL,
    "price" TEXT,
    "trustScore" INTEGER,
    "rank" INTEGER,
    "source" "public"."FavoriteSource" NOT NULL DEFAULT 'recommendation',
    "historyId" TEXT,
    "snapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorSession_token_key" ON "public"."VisitorSession"("token");

-- CreateIndex
CREATE INDEX "VisitorSession_lastSeenAt_idx" ON "public"."VisitorSession"("lastSeenAt");

-- CreateIndex
CREATE INDEX "SearchHistory_sessionId_createdAt_idx" ON "public"."SearchHistory"("sessionId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_sessionId_searchKeyword_key" ON "public"."Favorite"("sessionId", "searchKeyword");

-- CreateIndex
CREATE INDEX "Favorite_sessionId_createdAt_idx" ON "public"."Favorite"("sessionId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "public"."SearchHistory" ADD CONSTRAINT "SearchHistory_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "public"."SearchHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
