-- AlterTable
ALTER TABLE "rides" ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endingTime" DROP NOT NULL,
ALTER COLUMN "durationTaken" DROP NOT NULL,
ALTER COLUMN "currentLocationLat" DROP NOT NULL,
ALTER COLUMN "currentLocationLong" DROP NOT NULL;
