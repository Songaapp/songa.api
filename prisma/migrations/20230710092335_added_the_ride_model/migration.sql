-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PENDING', 'ENROUTE', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "rides" (
    "id" TEXT NOT NULL,
    "pickupPointLat" DOUBLE PRECISION NOT NULL,
    "pickupPointLong" DOUBLE PRECISION NOT NULL,
    "destinationLat" DOUBLE PRECISION NOT NULL,
    "destinationLong" DOUBLE PRECISION NOT NULL,
    "status" "TripStatus" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endingTime" TIMESTAMP(3) NOT NULL,
    "durationTaken" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "riderId" TEXT NOT NULL,
    "currentLocationLat" DOUBLE PRECISION NOT NULL,
    "currentLocationLong" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rides_id_key" ON "rides"("id");

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "riders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
