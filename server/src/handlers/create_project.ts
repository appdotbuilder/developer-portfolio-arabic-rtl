
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput, type Project } from '../schema';

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  try {
    // Insert project record
    const result = await db.insert(projectsTable)
      .values({
        title: input.title,
        description: input.description,
        short_description: input.short_description,
        technologies_used: input.technologies_used,
        live_demo_url: input.live_demo_url,
        github_url: input.github_url,
        image_url: input.image_url,
        display_order: input.display_order ?? 0, // Use Zod default if not provided
        is_featured: input.is_featured ?? false // Use Zod default if not provided
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Project creation failed:', error);
    throw error;
  }
};
