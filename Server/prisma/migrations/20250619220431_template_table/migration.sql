/*
  Warnings:

  - You are about to drop the column `exercise_id` on the `ExerciseLog` table. All the data in the column will be lost.
  - You are about to drop the column `workout_log_id` on the `ExerciseLog` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `WorkoutLog` table. All the data in the column will be lost.
  - You are about to drop the `Workout` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workoutLogId,exerciseId]` on the table `ExerciseLog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workoutLogId,order]` on the table `ExerciseLog` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `exerciseId` to the `ExerciseLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workoutLogId` to the `ExerciseLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `WorkoutLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExerciseLog" DROP CONSTRAINT "ExerciseLog_exercise_id_fkey";

-- DropForeignKey
ALTER TABLE "ExerciseLog" DROP CONSTRAINT "ExerciseLog_workout_log_id_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_user_id_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutLog" DROP CONSTRAINT "WorkoutLog_user_id_fkey";

-- DropIndex
DROP INDEX "ExerciseLog_workout_log_id_exercise_id_key";

-- DropIndex
DROP INDEX "ExerciseLog_workout_log_id_order_key";

-- AlterTable
ALTER TABLE "ExerciseLog" DROP COLUMN "exercise_id",
DROP COLUMN "workout_log_id",
ADD COLUMN     "exerciseId" INTEGER NOT NULL,
ADD COLUMN     "workoutLogId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutLog" DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Workout";

-- CreateTable
CREATE TABLE "Template" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "template_name" TEXT NOT NULL,
    "template_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseLog_workoutLogId_exerciseId_key" ON "ExerciseLog"("workoutLogId", "exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseLog_workoutLogId_order_key" ON "ExerciseLog"("workoutLogId", "order");

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseLog" ADD CONSTRAINT "ExerciseLog_workoutLogId_fkey" FOREIGN KEY ("workoutLogId") REFERENCES "WorkoutLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseLog" ADD CONSTRAINT "ExerciseLog_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
