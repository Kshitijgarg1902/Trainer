/*
  Warnings:

  - You are about to drop the column `Notes` on the `ExerciseLog` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `rep` on the `Set` table. All the data in the column will be lost.
  - You are about to drop the column `Notes` on the `WorkoutLog` table. All the data in the column will be lost.
  - Added the required column `reps` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciseLog" DROP COLUMN "Notes",
ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "Set" DROP COLUMN "Type",
DROP COLUMN "rep",
ADD COLUMN     "reps" INTEGER NOT NULL,
ADD COLUMN     "type" "SetType" NOT NULL DEFAULT 'Working';

-- AlterTable
ALTER TABLE "WorkoutLog" DROP COLUMN "Notes",
ADD COLUMN     "notes" TEXT;
