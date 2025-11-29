/*
  Warnings:

  - You are about to drop the `UserInterest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserInterest";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_InterestToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_InterestToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Interest" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_InterestToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_InterestToUser_AB_unique" ON "_InterestToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_InterestToUser_B_index" ON "_InterestToUser"("B");
