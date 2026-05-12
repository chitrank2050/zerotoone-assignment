-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PLANNER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PLANNER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationTaxonomy" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "LocationTaxonomy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionTaxonomy" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "TransactionTaxonomy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataDictionary" (
    "id" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "fieldDescription" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "attributes" TEXT,
    "fieldValues" TEXT,
    "minRange" DOUBLE PRECISION,
    "maxRange" DOUBLE PRECISION,

    CONSTRAINT "DataDictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldValue" (
    "id" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "FieldValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudienceSegment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "signals" JSONB NOT NULL,
    "sizeEstimate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudienceSegment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Conversation_userId_idx" ON "Conversation"("userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationTaxonomy_externalId_key" ON "LocationTaxonomy"("externalId");

-- CreateIndex
CREATE INDEX "LocationTaxonomy_externalId_idx" ON "LocationTaxonomy"("externalId");

-- CreateIndex
CREATE INDEX "LocationTaxonomy_parentId_idx" ON "LocationTaxonomy"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionTaxonomy_externalId_key" ON "TransactionTaxonomy"("externalId");

-- CreateIndex
CREATE INDEX "TransactionTaxonomy_externalId_idx" ON "TransactionTaxonomy"("externalId");

-- CreateIndex
CREATE INDEX "TransactionTaxonomy_parentId_idx" ON "TransactionTaxonomy"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "DataDictionary_fieldName_key" ON "DataDictionary"("fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "FieldValue_fieldName_value_key" ON "FieldValue"("fieldName", "value");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationTaxonomy" ADD CONSTRAINT "LocationTaxonomy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LocationTaxonomy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTaxonomy" ADD CONSTRAINT "TransactionTaxonomy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TransactionTaxonomy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
