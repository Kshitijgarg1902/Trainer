/*
  Warnings:

  - The values [Warmup,Failure,Working] on the enum `SetType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `notes` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Set` table. All the data in the column will be lost.
  - Made the column `weight` on table `Set` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SetType_new" AS ENUM ('W', 'F', 'N');
ALTER TABLE "Set" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Set" ALTER COLUMN "type" TYPE "SetType_new" USING ("type"::text::"SetType_new");
ALTER TYPE "SetType" RENAME TO "SetType_old";
ALTER TYPE "SetType_new" RENAME TO "SetType";
DROP TYPE "SetType_old";
ALTER TABLE "Set" ALTER COLUMN "type" SET DEFAULT 'N';
COMMIT;

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "notes",
DROP COLUMN "time",
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'N';
