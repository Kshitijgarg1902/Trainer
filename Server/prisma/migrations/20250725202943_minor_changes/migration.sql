/*
  Warnings:

  - You are about to drop the column `is_bodyweight` on the `Exercise` table. All the data in the column will be lost.
  - You are about to alter the column `weight` on the `Set` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "is_bodyweight";

-- AlterTable
ALTER TABLE "Set" ALTER COLUMN "weight" SET DATA TYPE INTEGER;
