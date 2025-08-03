/*
  Warnings:

  - You are about to drop the column `x1` on the `map_zone` table. All the data in the column will be lost.
  - You are about to drop the column `x2` on the `map_zone` table. All the data in the column will be lost.
  - You are about to drop the column `y1` on the `map_zone` table. All the data in the column will be lost.
  - You are about to drop the column `y2` on the `map_zone` table. All the data in the column will be lost.
  - Added the required column `geojson` to the `map_zone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `map_zone` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_map_zone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "geojson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_map_zone" ("id") SELECT "id" FROM "map_zone";
DROP TABLE "map_zone";
ALTER TABLE "new_map_zone" RENAME TO "map_zone";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
