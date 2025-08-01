
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { getSkills } from '../handlers/get_skills';

const createTestSkill = async (input: CreateSkillInput) => {
  const result = await db.insert(skillsTable)
    .values({
      name: input.name,
      category: input.category,
      proficiency_level: input.proficiency_level,
      icon_url: input.icon_url,
      display_order: input.display_order ?? 0
    })
    .returning()
    .execute();

  return result[0];
};

describe('getSkills', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no skills exist', async () => {
    const result = await getSkills();

    expect(result).toEqual([]);
  });

  it('should return all skills', async () => {
    // Create test skills
    await createTestSkill({
      name: 'JavaScript',
      category: 'Programming Languages',
      proficiency_level: 4,
      icon_url: 'js-icon.png',
      display_order: 1
    });

    await createTestSkill({
      name: 'React',
      category: 'Frameworks',
      proficiency_level: 5,
      icon_url: 'react-icon.png',
      display_order: 2
    });

    const result = await getSkills();

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('JavaScript');
    expect(result[0].category).toEqual('Programming Languages');
    expect(result[0].proficiency_level).toEqual(4);
    expect(result[0].icon_url).toEqual('js-icon.png');
    expect(result[0].display_order).toEqual(1);
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);

    expect(result[1].name).toEqual('React');
    expect(result[1].category).toEqual('Frameworks');
    expect(result[1].proficiency_level).toEqual(5);
    expect(result[1].icon_url).toEqual('react-icon.png');
    expect(result[1].display_order).toEqual(2);
  });

  it('should return skills ordered by display_order ascending', async () => {
    // Create skills in reverse display order
    await createTestSkill({
      name: 'Third Skill',
      category: 'Category C',
      proficiency_level: 3,
      icon_url: null,
      display_order: 30
    });

    await createTestSkill({
      name: 'First Skill',
      category: 'Category A',
      proficiency_level: 5,
      icon_url: null,
      display_order: 10
    });

    await createTestSkill({
      name: 'Second Skill',
      category: 'Category B',
      proficiency_level: 4,
      icon_url: null,
      display_order: 20
    });

    const result = await getSkills();

    expect(result).toHaveLength(3);
    expect(result[0].name).toEqual('First Skill');
    expect(result[0].display_order).toEqual(10);
    expect(result[1].name).toEqual('Second Skill');
    expect(result[1].display_order).toEqual(20);
    expect(result[2].name).toEqual('Third Skill');
    expect(result[2].display_order).toEqual(30);
  });

  it('should handle nullable fields correctly', async () => {
    await createTestSkill({
      name: 'Test Skill',
      category: 'Test Category',
      proficiency_level: 3,
      icon_url: null,
      display_order: 0
    });

    const result = await getSkills();

    expect(result).toHaveLength(1);
    expect(result[0].icon_url).toBeNull();
    expect(result[0].display_order).toEqual(0);
  });
});
