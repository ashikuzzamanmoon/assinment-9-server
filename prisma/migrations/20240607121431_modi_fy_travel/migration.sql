/*
  Warnings:

  - Added the required column `senderId` to the `travelbuddyrequests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "travelbuddyrequests" ADD COLUMN     "senderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "travelbuddyrequests" ADD CONSTRAINT "travelbuddyrequests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
