
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type UpdateSkillInput, type CreateSkillInput } from '../schema';
import { updateSkill } from '../handlers/update_skill';
import { eq } from 'drizzle-orm';

// Test skill input for creation
const testSkillInput: CreateSkillInput = {
  name: 'JavaScript',
  category: 'Programming',
  proficiency_level: 3,
  icon_url: 'https://example.com/js-icon.png',
  display_order: 1
};

describe('updateSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a skill with all fields', async () => {
    // Create test skill first
    const createdSkill = await db.insert(skillsTable)
      .values(testSkillInput)
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    const updateInput: UpdateSkillInput = {
      id: skillId,
      name: 'TypeScript',
      category: 'Programming Languages',
      proficiency_level: 5,
      icon_url: 'https://example.com/ts-icon.png',
      display_order: 2
    };

    const result = await updateSkill(updateInput);

    expect(result.id).toEqual(skillId);
    expect(result.name).toEqual('TypeScript');
    expect(result.category).toEqual('Programming Languages');
    expect(result.proficiency_level).toEqual(5);
    expect(result.icon_url).toEqual('https://example.com/ts-icon.png');
    expect(result.display_order).toEqual(2);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update only provided fields', async () => {
    // Create test skill first
    const createdSkill = await db.insert(skillsTable)
      .values(testSkillInput)
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    const updateInput: UpdateSkillInput = {
      id: skillId,
      name: 'Updated JavaScript',
      proficiency_level: 4
    };

    const result = await updateSkill(updateInput);

    expect(result.id).toEqual(skillId);
    expect(result.name).toEqual('Updated JavaScript');
    expect(result.category).toEqual('Programming'); // Should remain unchanged
    expect(result.proficiency_level).toEqual(4);
    expect(result.icon_url).toEqual('https://example.com/js-icon.png'); // Should remain unchanged
    expect(result.display_order).toEqual(1); // Should remain unchanged
  });

  it('should update skill in database', async () => {
    // Create test skill first
    const createdSkill = await db.insert(skillsTable)
      .values(testSkillInput)
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    const updateInput: UpdateSkillInput = {
      id: skillId,
      name: 'React',
      category: 'Frameworks'
    };

    await updateSkill(updateInput);

    // Query the updated skill from database
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skillId))
      .execute();

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toEqual('React');
    expect(skills[0].category).toEqual('Frameworks');
    expect(skills[0].proficiency_level).toEqual(3); // Should remain unchanged
  });

  it('should handle nullable fields correctly', async () => {
    // Create test skill first
    const createdSkill = await db.insert(skillsTable)
      .values(testSkillInput)
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    const updateInput: UpdateSkillInput = {
      id: skillId,
      icon_url: null
    };

    const result = await updateSkill(updateInput);

    expect(result.id).toEqual(skillId);
    expect(result.icon_url).toBeNull();
    expect(result.name).toEqual('JavaScript'); // Should remain unchanged
  });

  it('should throw error when skill not found', async () => {
    const updateInput: UpdateSkillInput = {
      id: 99999,
      name: 'Non-existent Skill'
    };

    expect(updateSkill(updateInput)).rejects.toThrow(/skill with id 99999 not found/i);
  });
});
