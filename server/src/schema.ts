
import { z } from 'zod';

// Developer profile schema
export const developerProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  experience_years: z.number().int().nonnegative(),
  aspirations: z.string().nullable(),
  profile_image_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type DeveloperProfile = z.infer<typeof developerProfileSchema>;

// Input schema for creating/updating profile
export const updateProfileInputSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  bio: z.string().optional(),
  experience_years: z.number().int().nonnegative().optional(),
  aspirations: z.string().nullable().optional(),
  profile_image_url: z.string().nullable().optional()
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

// Skills schema
export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
  proficiency_level: z.number().int().min(1).max(5), // 1-5 scale
  icon_url: z.string().nullable(),
  display_order: z.number().int().nonnegative(),
  created_at: z.coerce.date()
});

export type Skill = z.infer<typeof skillSchema>;

// Input schema for creating skills
export const createSkillInputSchema = z.object({
  name: z.string(),
  category: z.string(),
  proficiency_level: z.number().int().min(1).max(5),
  icon_url: z.string().nullable(),
  display_order: z.number().int().nonnegative().optional()
});

export type CreateSkillInput = z.infer<typeof createSkillInputSchema>;

// Input schema for updating skills
export const updateSkillInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  category: z.string().optional(),
  proficiency_level: z.number().int().min(1).max(5).optional(),
  icon_url: z.string().nullable().optional(),
  display_order: z.number().int().nonnegative().optional()
});

export type UpdateSkillInput = z.infer<typeof updateSkillInputSchema>;

// Projects schema
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  short_description: z.string(),
  technologies_used: z.string(), // JSON string of array
  live_demo_url: z.string().nullable(),
  github_url: z.string().nullable(),
  image_url: z.string().nullable(),
  display_order: z.number().int().nonnegative(),
  is_featured: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

// Input schema for creating projects
export const createProjectInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  short_description: z.string(),
  technologies_used: z.string(),
  live_demo_url: z.string().nullable(),
  github_url: z.string().nullable(),
  image_url: z.string().nullable(),
  display_order: z.number().int().nonnegative().optional(),
  is_featured: z.boolean().optional()
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

// Input schema for updating projects
export const updateProjectInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  technologies_used: z.string().optional(),
  live_demo_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  display_order: z.number().int().nonnegative().optional(),
  is_featured: z.boolean().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Contact messages schema
export const contactMessageSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string().nullable(),
  message: z.string(),
  is_read: z.boolean(),
  created_at: z.coerce.date()
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

// Input schema for creating contact messages
export const createContactMessageInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string().nullable(),
  message: z.string()
});

export type CreateContactMessageInput = z.infer<typeof createContactMessageInputSchema>;

// Contact info schema
export const contactInfoSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  phone: z.string().nullable(),
  location: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  github_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  website_url: z.string().nullable(),
  updated_at: z.coerce.date()
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Input schema for updating contact info
export const updateContactInfoInputSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  twitter_url: z.string().nullable().optional(),
  website_url: z.string().nullable().optional()
});

export type UpdateContactInfoInput = z.infer<typeof updateContactInfoInputSchema>;
