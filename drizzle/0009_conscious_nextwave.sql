CREATE TABLE "watch_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"movie_id" text NOT NULL,
	"title" text NOT NULL,
	"poster_path" text,
	"category" "category" NOT NULL,
	"season_number" integer,
	"episode_number" integer,
	"progress" integer DEFAULT 0,
	"duration" integer,
	"watched_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "watch_history_user_id_movie_id_category_unique" UNIQUE("user_id","movie_id","category")
);
--> statement-breakpoint
ALTER TABLE "watch_history" ADD CONSTRAINT "watch_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;