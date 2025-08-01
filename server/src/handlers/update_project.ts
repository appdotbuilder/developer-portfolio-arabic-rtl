
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput, type Project } from '../schema';
import { eq } from 'drizzle-orm';

export const updateProject = async (input: UpdateProjectInput): Promise<Project> => {
  try {
    // Build update object with only provided fields
    const updateData: any = {};
    
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.short_description !== undefined) updateData.short_description = input.short_description;
    if (input.technologies_used !== undefined) updateData.technologies_used = input.technologies_used;
    if (input.live_demo_url !== undefined) updateData.live_demo_url = input.live_demo_url;
    if (input.github_url !== undefined) updateData.github_url = input.github_url;
    if (input.image_url !== undefined) updateData.image_url = input.image_url;
    if (input.display_order !== undefined) updateData.display_order = input.display_order;
    if (input.is_featured !== undefined) updateData.is_featured = input.is_featured;
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date();

    // Update project record
    const result = await db.update(projectsTable)
      .set(updateData)
      .where(eq(projectsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Project with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Project update failed:', error);
    throw error;
  }
};
