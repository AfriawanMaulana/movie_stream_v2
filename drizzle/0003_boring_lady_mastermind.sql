CREATE TYPE "public"."category" AS ENUM('movie', 'tv');--> statement-breakpoint
ALTER TABLE "watchlist" ADD COLUMN "category" "category" NOT NULL;