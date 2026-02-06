/*
  Warnings:

  - You are about to drop the column `user_id` on the `cart_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,product_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartId` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."cart_items" DROP CONSTRAINT "cart_items_user_id_fkey";

-- DropIndex
DROP INDEX "public"."cart_items_user_id_idx";

-- DropIndex
DROP INDEX "public"."cart_items_user_id_product_id_idx";

-- DropIndex
DROP INDEX "public"."cart_items_user_id_product_id_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "user_id",
ADD COLUMN     "cartId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "carts" (
    "user_id" TEXT NOT NULL,
    "total_amount" INTEGER NOT NULL DEFAULT 0,
    "total_items" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "cart_items_cartId_idx" ON "cart_items"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_product_id_key" ON "cart_items"("cartId", "product_id");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
