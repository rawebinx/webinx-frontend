import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hosts = pgTable("hosts", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar").notNull(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  expertise: text("expertise").array().notNull(),
  followers: integer("followers").notNull().default(0),
  website: text("website"),
});

export const webinars = pgTable("webinars", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hostId: varchar("host_id").notNull(),
  category: text("category").notNull(),
  sector: text("sector").notNull(),
  date: text("date").notNull(),
  duration: integer("duration").notNull(),
  attendees: integer("attendees").notNull().default(0),
  maxAttendees: integer("max_attendees").notNull().default(500),
  imageUrl: text("image_url").notNull(),
  isTrending: boolean("is_trending").notNull().default(false),
  isUpcoming: boolean("is_upcoming").notNull().default(true),
  isFree: boolean("is_free").notNull().default(true),
  price: integer("price").notNull().default(0),
  tags: text("tags").array().notNull(),
});

export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey(),
  webinarId: varchar("webinar_id").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  registeredAt: text("registered_at").notNull(),
});

export const insertHostSchema = createInsertSchema(hosts).omit({ id: true });
export const insertWebinarSchema = createInsertSchema(webinars).omit({ id: true });
export const insertRegistrationSchema = createInsertSchema(registrations).omit({ id: true, registeredAt: true });

export type InsertHost = z.infer<typeof insertHostSchema>;
export type InsertWebinar = z.infer<typeof insertWebinarSchema>;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;

export type Host = typeof hosts.$inferSelect;
export type Webinar = typeof webinars.$inferSelect;
export type Registration = typeof registrations.$inferSelect;

export type WebinarWithHost = Webinar & { host: Host };

export const CATEGORIES = [
  "Technology",
  "Marketing",
  "Finance",
  "Health & Wellness",
  "Design",
  "Leadership",
  "AI & Machine Learning",
  "Entrepreneurship",
  "Data Science",
  "Product",
] as const;

export const SECTORS = [
  "SaaS",
  "Healthcare",
  "Education",
  "Finance",
  "Retail",
  "Government",
  "Non-profit",
  "Media",
  "Real Estate",
  "Manufacturing",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Sector = (typeof SECTORS)[number];

export type User = { id: string; username: string; password: string };
export type InsertUser = { username: string; password: string };
