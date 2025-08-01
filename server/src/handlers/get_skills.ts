
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type Skill } from '../schema';
import { asc } from 'drizzle-orm';

export async function getSkills(): Promise<Skill[]> {
  try {
    const results = await db.select()
      .from(skillsTable)
      .orderBy(asc(skillsTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    throw error;
  }
}
