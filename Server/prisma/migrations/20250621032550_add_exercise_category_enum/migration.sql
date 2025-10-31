/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,equipment]` on the table `Exercise` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `category` on the `Exercise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "category",
ADD COLUMN     "category" "ExerciseCategory" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_userId_name_equipment_key" ON "Exercise"("userId", "name", "equipment");
