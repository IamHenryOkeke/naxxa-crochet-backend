-- CreateEnum
CREATE TYPE "ORDERSTATUS" AS ENUM ('Cancelled', 'Pending', 'Shipped', 'Delivered');

-- CreateEnum
CREATE TYPE "PAYMENTSTATUS" AS ENUM ('Unpaid', 'Pending', 'Paid');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "paymentStatus" "PAYMENTSTATUS" NOT NULL DEFAULT 'Unpaid',
    "total" DOUBLE PRECISION NOT NULL,
    "deliveryStatus" "ORDERSTATUS" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userFirstName" TEXT NOT NULL,
    "userLastName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userAddress" TEXT NOT NULL,
    "userCity" TEXT NOT NULL,
    "userState" TEXT NOT NULL,
    "userPhone" TEXT NOT NULL,
    "userWhatsappPhone" TEXT NOT NULL,
    "notes" TEXT,
    "userId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "size" "Size",

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
