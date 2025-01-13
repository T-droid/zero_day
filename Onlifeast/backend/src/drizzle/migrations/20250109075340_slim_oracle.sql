ALTER TABLE "food" ALTER COLUMN "image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "food" DROP COLUMN "category";--> statement-breakpoint
DROP TYPE "public"."category";