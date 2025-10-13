/*
  Warnings:

  - Changed the type of `photoSize` on the `product_photos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "product_photos" DROP COLUMN "photoSize",
ADD COLUMN     "photoSize" INTEGER NOT NULL;
