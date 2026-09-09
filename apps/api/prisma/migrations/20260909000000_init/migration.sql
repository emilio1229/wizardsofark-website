-- CreateSchema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "discordId" TEXT,
    "username" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'guest',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArkMap" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "imagePath" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArkMap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArkServer" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "name" TEXT NOT NULL,
    "sessionName" TEXT,
    "mapName" TEXT,
    "mapDisplayName" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "gamePort" INTEGER NOT NULL,
    "queryPort" INTEGER,
    "firstSeen" TIMESTAMP(3) NOT NULL,
    "lastSeen" TIMESTAMP(3),
    "lastChecked" TIMESTAMP(3) NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "previousStatus" TEXT,
    "players" INTEGER,
    "maxPlayers" INTEGER,
    "version" TEXT,
    "ping" INTEGER,
    "clusterId" TEXT,
    "isPve" BOOLEAN,
    "missingSince" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArkServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusTransition" (
    "id" SERIAL NOT NULL,
    "serverId" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "StatusTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerSnapshot" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "serverId" TEXT NOT NULL,
    "players" INTEGER,
    "maxPlayers" INTEGER,
    "status" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouncilMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "tagline" TEXT,
    "avatar" TEXT,
    "portrait" TEXT,
    "energyColor" TEXT,
    "bio" TEXT,
    "responsibilities" JSONB,
    "accessLevel" TEXT,
    "status" TEXT,
    "quote" TEXT,
    "angle" DOUBLE PRECISION,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CouncilMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "PollMeta" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollMeta_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE INDEX "ArkServer_currentStatus_idx" ON "ArkServer"("currentStatus");

-- CreateIndex
CREATE INDEX "ArkServer_mapId_idx" ON "ArkServer"("mapId");

-- CreateIndex
CREATE INDEX "ArkServer_lastChecked_idx" ON "ArkServer"("lastChecked");

-- CreateIndex
CREATE INDEX "StatusTransition_serverId_observedAt_idx" ON "StatusTransition"("serverId", "observedAt");

-- CreateIndex
CREATE INDEX "ServerSnapshot_serverId_capturedAt_idx" ON "ServerSnapshot"("serverId", "capturedAt");

-- AddForeignKey
ALTER TABLE "StatusTransition" ADD CONSTRAINT "StatusTransition_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ArkServer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerSnapshot" ADD CONSTRAINT "ServerSnapshot_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "ArkServer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
