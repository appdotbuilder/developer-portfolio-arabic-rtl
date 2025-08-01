
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteSkill = async (id: number): Promise<void> => {
  try {
    await db.delete(skillsTable)
      .where(eq(skillsTable.id, id))
      .execute();
  } catch (error) {
    console.error('Skill deletion failed:', error);
    throw error;
  }
};
