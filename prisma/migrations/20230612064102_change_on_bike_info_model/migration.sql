-- DropForeignKey
ALTER TABLE "bike_information" DROP CONSTRAINT "bike_information_riderId_fkey";

-- AddForeignKey
ALTER TABLE "bike_information" ADD CONSTRAINT "bike_information_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "rider_profiles"("riderId") ON DELETE RESTRICT ON UPDATE CASCADE;
