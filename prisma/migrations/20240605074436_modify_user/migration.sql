-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'DEACTIVATE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
