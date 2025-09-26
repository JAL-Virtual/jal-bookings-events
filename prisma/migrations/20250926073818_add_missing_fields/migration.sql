/*
  Warnings:

  - You are about to drop the column `location` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `maxCapacity` on the `events` table. All the data in the column will be lost.
  - Added the required column `arrival` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departure` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "slots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "slotNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "airline" TEXT,
    "flightNumber" TEXT,
    "aircraft" TEXT,
    "origin" TEXT,
    "destination" TEXT,
    "eobtEta" TEXT,
    "stand" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "slots_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "slotId" TEXT,
    "pilotId" TEXT NOT NULL,
    "pilotName" TEXT NOT NULL,
    "pilotEmail" TEXT NOT NULL,
    "jalId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bookings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "slots" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("createdAt", "eventId", "id", "pilotEmail", "pilotId", "pilotName", "status", "updatedAt") SELECT "createdAt", "eventId", "id", "pilotEmail", "pilotId", "pilotName", "status", "updatedAt" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "departure" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "time" TEXT NOT NULL,
    "picture" TEXT,
    "route" TEXT,
    "airline" TEXT,
    "flightNumber" TEXT,
    "aircraft" TEXT,
    "origin" TEXT,
    "destination" TEXT,
    "eobtEta" TEXT,
    "stand" TEXT,
    "maxPilots" INTEGER NOT NULL DEFAULT 10,
    "currentBookings" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_events" ("createdAt", "currentBookings", "date", "description", "id", "name", "status", "updatedAt") SELECT "createdAt", "currentBookings", "date", "description", "id", "name", "status", "updatedAt" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
