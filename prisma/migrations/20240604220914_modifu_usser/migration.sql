/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `Admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "contactNumber";

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
