-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RecommendationSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schemaVersion" INTEGER NOT NULL DEFAULT 1,
    "payload" JSON NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "answerPreview" TEXT,
    "model" TEXT,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SearchHistory_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisitorSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SearchHistory_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "RecommendationSnapshot" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "searchKeyword" TEXT NOT NULL,
    "price" TEXT,
    "trustScore" INTEGER,
    "rank" INTEGER,
    "source" TEXT NOT NULL DEFAULT 'recommendation',
    "historyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisitorSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "SearchHistory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorSession_token_key" ON "VisitorSession"("token");

-- CreateIndex
CREATE UNIQUE INDEX "SearchHistory_snapshotId_key" ON "SearchHistory"("snapshotId");

-- CreateIndex
CREATE INDEX "SearchHistory_sessionId_createdAt_idx" ON "SearchHistory"("sessionId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_sessionId_searchKeyword_key" ON "Favorite"("sessionId", "searchKeyword");

-- CreateIndex
CREATE INDEX "Favorite_sessionId_createdAt_idx" ON "Favorite"("sessionId", "createdAt" DESC);
