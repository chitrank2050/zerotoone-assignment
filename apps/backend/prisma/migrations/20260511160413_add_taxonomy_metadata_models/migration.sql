-- CreateTable
CREATE TABLE "DataDictionary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldName" TEXT NOT NULL,
    "fieldDescription" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "attributes" TEXT,
    "fieldValues" TEXT,
    "minRange" REAL,
    "maxRange" REAL
);

-- CreateTable
CREATE TABLE "FieldValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fieldName" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DataDictionary_fieldName_key" ON "DataDictionary"("fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "FieldValue_fieldName_value_key" ON "FieldValue"("fieldName", "value");
