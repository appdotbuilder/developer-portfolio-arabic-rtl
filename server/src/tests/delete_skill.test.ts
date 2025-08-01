
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { deleteSkill } from '../handlers/delete_skill';
import { eq } from 'drizzle-orm';

// Test skill data
const testSkill: CreateSkillInput = {
  name: 'TypeScript',
  category: 'Programming Languages',
  proficiency_level: 4,
  icon_url: 'https://example.com/typescript.svg',
  display_order: 1
};

describe('deleteSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete a skill successfully', async () => {
    // Create a skill first
    const [createdSkill] = await db.insert(skillsTable)
      .values({
        name: testSkill.name,
        category: testSkill.category,
        proficiency_level: testSkill.proficiency_level,
        icon_url: testSkill.icon_url,
        display_order: testSkill.display_order ?? 0
      })
      .returning()
      .execute();

    // Delete the skill
    await deleteSkill(createdSkill.id);

    // Verify the skill is deleted
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, createdSkill.id))
      .execute();

    expect(skills).toHaveLength(0);
  });

  it('should not throw error when deleting non-existent skill', async () => {
    // Attempt to delete a non-existent skill (ID 999)
    await expect(deleteSkill(999)).resolves.toBeUndefined();
  });

  it('should only delete the specified skill', async () => {
    // Create multiple skills
    const [skill1] = await db.insert(skillsTable)
      .values({
        name: 'JavaScript',
        category: 'Programming Languages',
        proficiency_level: 5,
        icon_url: null,
        display_order: 0
      })
      .returning()
      .execute();

    const [skill2] = await db.insert(skillsTable)
      .values({
        name: 'React',
        category: 'Frontend Frameworks',
        proficiency_level: 4,
        icon_url: null,
        display_order: 1
      })
      .returning()
      .execute();

    // Delete only the first skill
    await deleteSkill(skill1.id);

    // Verify first skill is deleted
    const deletedSkills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skill1.id))
      .execute();

    expect(deletedSkills).toHaveLength(0);

    // Verify second skill still exists
    const remainingSkills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skill2.id))
      .execute();

    expect(remainingSkills).toHaveLength(1);
    expect(remainingSkills[0].name).toEqual('React');
  });
});
