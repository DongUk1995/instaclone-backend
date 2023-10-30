/*
  Warnings:

  - Added the required column `hashtag` to the `Hashtag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hashtag" ADD COLUMN     "hashtag" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_HashtagToPhoto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HashtagToPhoto_AB_unique" ON "_HashtagToPhoto"("A", "B");

-- CreateIndex
CREATE INDEX "_HashtagToPhoto_B_index" ON "_HashtagToPhoto"("B");

-- AddForeignKey
ALTER TABLE "_HashtagToPhoto" ADD CONSTRAINT "_HashtagToPhoto_A_fkey" FOREIGN KEY ("A") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HashtagToPhoto" ADD CONSTRAINT "_HashtagToPhoto_B_fkey" FOREIGN KEY ("B") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
