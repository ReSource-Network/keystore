-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletId" TEXT NOT NULL,
    "key" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet.id_unique" ON "Wallet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet.walletId_unique" ON "Wallet"("walletId");
