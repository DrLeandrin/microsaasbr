import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const entries = pgTable("entries", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  explanation: text("explanation"),
  integrations: jsonb("integrations").$type<{ slug: string; name: string }[]>().notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty"),
  difficultyNote: text("difficulty_note"),
  authorName: text("author_name"),
  authorUrl: text("author_url"),
  sourceUrl: text("source_url"),
  sourceName: text("source_name"),
  sourceDate: date("source_date"),
  licenseNote: text("license_note"),
  nodeCount: integer("node_count"),
  jsonDownloadable: boolean("json_downloadable").notNull().default(false),
  hostedJson: text("hosted_json"),
  price: text("price"),
  priceAsShown: text("price_as_shown"),
  purchaseUrl: text("purchase_url"),
  listed: boolean("listed").notNull().default(true),
  addedAt: date("added_at").notNull(),
  popularity: integer("popularity").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sourceUrl: text("source_url"),
  workflowJson: text("workflow_json"),
  description: text("description").notNull(),
  integrations: text("integrations").notNull(),
  category: text("category").notNull(),
  authorName: text("author_name").notNull(),
  email: text("email").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  entryId: integer("entry_id"),
});

export const signups = pgTable("signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  resendId: text("resend_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const searches = pgTable("searches", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pageviews = pgTable(
  "pageviews",
  {
    id: serial("id").primaryKey(),
    path: text("path").notNull(),
    day: date("day").notNull(),
    count: integer("count").notNull().default(0),
  },
  (table) => [uniqueIndex("pageviews_path_day_idx").on(table.path, table.day)],
);

export const sponsorWeeks = pgTable("sponsor_weeks", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  barText: text("bar_text").notNull(),
  startsOn: date("starts_on").notNull(),
  endsOn: date("ends_on").notNull(),
  newsletterLine: text("newsletter_line"),
  slot: text("slot").notNull().default("semana"),
  categorySlug: text("category_slug"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sponsorClicks = pgTable("sponsor_clicks", {
  id: serial("id").primaryKey(),
  sponsorSlug: text("sponsor_slug").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sponsorInquiries = pgTable("sponsor_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  plan: text("plan").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const errors = pgTable("errors", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  stack: text("stack"),
  path: text("path"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
