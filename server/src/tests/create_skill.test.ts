
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { createSkill } from '../handlers/create_skill';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateSkillInput = {
  name: 'TypeScript',
  category: 'Programming Languages',
  proficiency_level: 4,
  icon_url: 'https://example.com/typescript.png',
  display_order: 1
};

describe('createSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a skill with all fields', async () => {
    const result = await createSkill(testInput);

    // Basic field validation
    expect(result.name).toEqual('TypeScript');
    expect(result.category).toEqual('Programming Languages');
    expect(result.proficiency_level).toEqual(4);
    expect(result.icon_url).toEqual('https://example.com/typescript.png');
    expect(result.display_order).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save skill to database', async () => {
    const result = await createSkill(testInput);

    // Query using proper drizzle syntax
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, result.id))
      .execute();

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toEqual('TypeScript');
    expect(skills[0].category).toEqual('Programming Languages');
    expect(skills[0].proficiency_level).toEqual(4);
    expect(skills[0].icon_url).toEqual('https://example.com/typescript.png');
    expect(skills[0].display_order).toEqual(1);
    expect(skills[0].created_at).toBeInstanceOf(Date);
  });

  it('should create skill with default display_order when not provided', async () => {
    const inputWithoutDisplayOrder: CreateSkillInput = {
      name: 'JavaScript',
      category: 'Programming Languages',
      proficiency_level: 5,
      icon_url: null
    };

    const result = await createSkill(inputWithoutDisplayOrder);

    expect(result.name).toEqual('JavaScript');
    expect(result.category).toEqual('Programming Languages');
    expect(result.proficiency_level).toEqual(5);
    expect(result.icon_url).toBeNull();
    expect(result.display_order).toEqual(0); // Default value
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create skill with null icon_url', async () => {
    const inputWithNullIcon: CreateSkillInput = {
      name: 'Python',
      category: 'Programming Languages',
      proficiency_level: 3,
      icon_url: null,
      display_order: 2
    };

    const result = await createSkill(inputWithNullIcon);

    expect(result.name).toEqual('Python');
    expect(result.icon_url).toBeNull();
    expect(result.display_order).toEqual(2);

    // Verify in database
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, result.id))
      .execute();

    expect(skills[0].icon_url).toBeNull();
  });

  it('should handle different proficiency levels correctly', async () => {
    const skillInputs: CreateSkillInput[] = [
      {
        name: 'Beginner Skill',
        category: 'Test Category',
        proficiency_level: 1,
        icon_url: null,
        display_order: 0
      },
      {
        name: 'Expert Skill',
        category: 'Test Category',
        proficiency_level: 5,
        icon_url: null,
        display_order: 1
      }
    ];

    const results = await Promise.all(
      skillInputs.map(input => createSkill(input))
    );

    expect(results[0].proficiency_level).toEqual(1);
    expect(results[1].proficiency_level).toEqual(5);

    // Verify both skills are in database
    const allSkills = await db.select()
      .from(skillsTable)
      .execute();

    expect(allSkills).toHaveLength(2);
    expect(allSkills.some(skill => skill.proficiency_level === 1)).toBe(true);
    expect(allSkills.some(skill => skill.proficiency_level === 5)).toBe(true);
  });
});
