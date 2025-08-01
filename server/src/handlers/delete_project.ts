
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteProject = async (id: number): Promise<void> => {
  try {
    // Delete the project by ID
    const result = await db.delete(projectsTable)
      .where(eq(projectsTable.id, id))
      .execute();

    // Note: We don't need to check if the project existed
    // The operation succeeds even if no rows were affected
  } catch (error) {
    console.error('Project deletion failed:', error);
    throw error;
  }
};
