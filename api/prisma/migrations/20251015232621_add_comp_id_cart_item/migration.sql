/*
  Warnings:

  - The primary key for the `cart_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `cart_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,product_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_user_id_product_id_key" ON "cart_items"("user_id", "product_id");
