/*
  Warnings:

  - You are about to drop the column `offeredById` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `wantedById` on the `Skill` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_offeredById_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_wantedById_fkey";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "offeredById",
DROP COLUMN "wantedById";

-- CreateTable
CREATE TABLE "OfferedSkill" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "OfferedSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WantedSkill" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "WantedSkill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfferedSkill" ADD CONSTRAINT "OfferedSkill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferedSkill" ADD CONSTRAINT "OfferedSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WantedSkill" ADD CONSTRAINT "WantedSkill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WantedSkill" ADD CONSTRAINT "WantedSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
