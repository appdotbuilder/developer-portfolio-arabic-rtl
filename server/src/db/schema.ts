
import { serial, text, pgTable, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const developerProfileTable = pgTable('developer_profile', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  bio: text('bio').notNull(),
  experience_years: integer('experience_years').notNull(),
  aspirations: text('aspirations'), // Nullable by default
  profile_image_url: text('profile_image_url'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const skillsTable = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  proficiency_level: integer('proficiency_level').notNull(), // 1-5 scale
  icon_url: text('icon_url'), // Nullable by default
  display_order: integer('display_order').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  short_description: text('short_description').notNull(),
  technologies_used: text('technologies_used').notNull(), // JSON string of array
  live_demo_url: text('live_demo_url'), // Nullable by default
  github_url: text('github_url'), // Nullable by default
  image_url: text('image_url'), // Nullable by default
  display_order: integer('display_order').notNull().default(0),
  is_featured: boolean('is_featured').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const contactMessagesTable = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'), // Nullable by default
  message: text('message').notNull(),
  is_read: boolean('is_read').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const contactInfoTable = pgTable('contact_info', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  phone: text('phone'), // Nullable by default
  location: text('location'), // Nullable by default
  linkedin_url: text('linkedin_url'), // Nullable by default
  github_url: text('github_url'), // Nullable by default
  twitter_url: text('twitter_url'), // Nullable by default
  website_url: text('website_url'), // Nullable by default
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// TypeScript types for the table schemas
export type DeveloperProfile = typeof developerProfileTable.$inferSelect;
export type NewDeveloperProfile = typeof developerProfileTable.$inferInsert;
export type Skill = typeof skillsTable.$inferSelect;
export type NewSkill = typeof skillsTable.$inferInsert;
export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;
export type ContactMessage = typeof contactMessagesTable.$inferSelect;
export type NewContactMessage = typeof contactMessagesTable.$inferInsert;
export type ContactInfo = typeof contactInfoTable.$inferSelect;
export type NewContactInfo = typeof contactInfoTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  developerProfile: developerProfileTable,
  skills: skillsTable,
  projects: projectsTable,
  contactMessages: contactMessagesTable,
  contactInfo: contactInfoTable
};
