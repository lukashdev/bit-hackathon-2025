-- CreateTable
CREATE TABLE "_ActivityToInterest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ActivityToInterest_A_fkey" FOREIGN KEY ("A") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ActivityToInterest_B_fkey" FOREIGN KEY ("B") REFERENCES "Interest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_ActivityToInterest_AB_unique" ON "_ActivityToInterest"("A", "B");

-- CreateIndex
CREATE INDEX "_ActivityToInterest_B_index" ON "_ActivityToInterest"("B");
