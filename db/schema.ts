import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  pgEnum,
  boolean,
  integer,
  unique,
  index,
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

export const watchHistory = pgTable(
  "watch_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    movieId: text("movie_id").notNull(),
    title: text("title").notNull(),
    posterPath: text("poster_path"),
    backdropPath: text("backdrop_path"),
    category: categoryEnum("category").notNull(),
    server: integer("server").notNull(),
    seasonNumber: integer("season_number"),
    episodeNumber: integer("episode_number"),
    progress: integer("progress").default(0),
    duration: integer("duration"),
    watchedAt: timestamp("watched_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueWatchL: unique().on(table.userId, table.movieId, table.category),
  })
);

export const pageViews = pgTable(
  "page_views",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    path: text("path").notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    visitorId: text("visitor_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    createdAtIdx: index("pv_created_at_idx").on(table.createdAt),
    visitorIdIdx: index("pv_visitor_id_idx").on(table.visitorId),
  })
);

