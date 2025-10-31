/*
  Warnings:

  - You are about to drop the column `templateData` on the `Template` table. All the data in the column will be lost.
  - Added the required column `template` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "templateData",
ADD COLUMN     "template" JSONB NOT NULL;
