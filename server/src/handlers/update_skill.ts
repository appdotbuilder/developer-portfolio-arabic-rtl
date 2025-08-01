
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type UpdateSkillInput, type Skill } from '../schema';
import { eq } from 'drizzle-orm';

export const updateSkill = async (input: UpdateSkillInput): Promise<Skill> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    
    if (input.name !== undefined) {
      updateData['name'] = input.name;
    }
    
    if (input.category !== undefined) {
      updateData['category'] = input.category;
    }
    
    if (input.proficiency_level !== undefined) {
      updateData['proficiency_level'] = input.proficiency_level;
    }
    
    if (input.icon_url !== undefined) {
      updateData['icon_url'] = input.icon_url;
    }
    
    if (input.display_order !== undefined) {
      updateData['display_order'] = input.display_order;
    }

    // Update skill record
    const result = await db.update(skillsTable)
      .set(updateData)
      .where(eq(skillsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Skill with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Skill update failed:', error);
    throw error;
  }
};
