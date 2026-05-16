-- CreateTable
CREATE TABLE "AiReport" (
    "id" TEXT NOT NULL,
    "periodType" TEXT NOT NULL,
    "dateRange" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiReport_userId_createdAt_idx" ON "AiReport"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Note_userId_idx" ON "Note"("userId");

-- AddForeignKey
ALTER TABLE "AiReport" ADD CONSTRAINT "AiReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
