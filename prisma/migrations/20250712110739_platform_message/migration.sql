-- CreateTable
CREATE TABLE "PlatformMessage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "PlatformMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlatformMessage_isActive_idx" ON "PlatformMessage"("isActive");

-- CreateIndex
CREATE INDEX "PlatformMessage_createdAt_idx" ON "PlatformMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "PlatformMessage" ADD CONSTRAINT "PlatformMessage_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
