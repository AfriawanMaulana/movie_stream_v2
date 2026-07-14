import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "premium", "admin"]);
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  username: varchar("username", { length: 16 }).notNull(),
  email: text("email").notNull().unique(),
  role: roleEnum("role").default("user").notNull(),
  isBanned: boolean("is_banned").notNull().default(false),
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

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  username: text("username").notNull(),
  movie_id: text("movie_id").notNull(),
  title: text("title").notNull(),
  category: categoryEnum("category").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
