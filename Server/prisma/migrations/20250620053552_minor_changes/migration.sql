/*
  Warnings:

  - You are about to drop the column `user_id` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `template_data` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `template_name` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Template` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Exercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Set` table without a default value. This is not possible if the table is not empty.
  - Added the required column `templateData` to the `Template` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Set" DROP CONSTRAINT "Set_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_user_id_fkey";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "template_data",
DROP COLUMN "template_name",
DROP COLUMN "user_id",
ADD COLUMN     "templateData" JSONB NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
