import {
  index,
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  username: varchar("username", { length: 16 }).notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const categoryEnum = pgEnum("category", ["movie", "tv"]);
export const watchlist = pgTable("watchlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  movie_id: text("movie_id").notNull(),
  category: categoryEnum("category").notNull(),
  poster_path: text("poster_path"),
  title: text("title").notNull(),
  saved_at: timestamp("saved_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
