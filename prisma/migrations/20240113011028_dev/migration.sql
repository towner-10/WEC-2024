-- CreateTable
CREATE TABLE "Disaster" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "longitude" REAL NOT NULL,
    "latitude" REAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "intensity" INTEGER NOT NULL,
    CONSTRAINT "Disaster_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "DisasterType" ("typeName") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DisasterType" (
    "typeName" TEXT NOT NULL PRIMARY KEY
);
