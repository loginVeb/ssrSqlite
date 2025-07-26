-- CreateTable
CREATE TABLE "map_zone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x1" REAL NOT NULL,
    "y1" REAL NOT NULL,
    "x2" REAL NOT NULL,
    "y2" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "marker_in_the_zone" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "map_zone_id" INTEGER
);

-- CreateIndex
CREATE INDEX "map_zone_id" ON "marker_in_the_zone"("map_zone_id");
