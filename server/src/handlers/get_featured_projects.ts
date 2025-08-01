
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type Project } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getFeaturedProjects = async (): Promise<Project[]> => {
  try {
    const results = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.is_featured, true))
      .orderBy(asc(projectsTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Featured projects retrieval failed:', error);
    throw error;
  }
};
