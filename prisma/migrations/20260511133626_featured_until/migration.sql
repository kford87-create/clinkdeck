-- Convert featured (Boolean) to featuredUntil (DateTime?)
-- Existing featured=true rows get a 90-day window from now; featured=false rows become NULL.

ALTER TABLE "Listing" ADD COLUMN "featuredUntil" TIMESTAMP(3);

UPDATE "Listing"
SET "featuredUntil" = NOW() + INTERVAL '90 days'
WHERE "featured" = true;

ALTER TABLE "Listing" DROP COLUMN "featured";
