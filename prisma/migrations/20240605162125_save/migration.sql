/*
  Warnings:

  - The values [REJECT] on the enum `RquestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The `status` column on the `travelbuddyrequests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RquestStatus_new" AS ENUM ('APPROVED', 'PENDING');
ALTER TABLE "travelbuddyrequests" ALTER COLUMN "status" TYPE "RquestStatus_new" USING ("status"::text::"RquestStatus_new");
ALTER TYPE "RquestStatus" RENAME TO "RquestStatus_old";
ALTER TYPE "RquestStatus_new" RENAME TO "RquestStatus";
DROP TYPE "RquestStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "travelbuddyrequests" DROP COLUMN "status",
ADD COLUMN     "status" "RquestStatus" NOT NULL DEFAULT 'PENDING';
