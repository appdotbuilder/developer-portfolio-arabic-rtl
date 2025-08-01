
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { developerProfileTable } from '../db/schema';
import { type UpdateProfileInput } from '../schema';
import { updateProfile } from '../handlers/update_profile';
import { eq } from 'drizzle-orm';

describe('updateProfile', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a new profile when none exists', async () => {
    const input: UpdateProfileInput = {
      name: 'John Doe',
      title: 'Full Stack Developer',
      bio: 'Experienced developer with 5 years in web development',
      experience_years: 5,
      aspirations: 'To become a tech lead',
      profile_image_url: 'https://example.com/profile.jpg'
    };

    const result = await updateProfile(input);

    expect(result.id).toBeDefined();
    expect(result.name).toEqual('John Doe');
    expect(result.title).toEqual('Full Stack Developer');
    expect(result.bio).toEqual('Experienced developer with 5 years in web development');
    expect(result.experience_years).toEqual(5);
    expect(result.aspirations).toEqual('To become a tech lead');
    expect(result.profile_image_url).toEqual('https://example.com/profile.jpg');
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create profile with defaults when minimal input provided', async () => {
    const input: UpdateProfileInput = {
      name: 'Jane Smith'
    };

    const result = await updateProfile(input);

    expect(result.name).toEqual('Jane Smith');
    expect(result.title).toEqual('Software Developer');
    expect(result.bio).toEqual('Passionate developer building amazing things.');
    expect(result.experience_years).toEqual(0);
    expect(result.aspirations).toBeNull();
    expect(result.profile_image_url).toBeNull();
  });

  it('should update existing profile', async () => {
    // Create initial profile
    await db.insert(developerProfileTable)
      .values({
        name: 'Original Name',
        title: 'Original Title',
        bio: 'Original bio',
        experience_years: 2,
        aspirations: 'Original aspirations',
        profile_image_url: 'original-image.jpg'
      })
      .execute();

    const input: UpdateProfileInput = {
      name: 'Updated Name',
      title: 'Updated Title',
      experience_years: 3
    };

    const result = await updateProfile(input);

    expect(result.name).toEqual('Updated Name');
    expect(result.title).toEqual('Updated Title');
    expect(result.experience_years).toEqual(3);
    // Unchanged fields should remain the same
    expect(result.bio).toEqual('Original bio');
    expect(result.aspirations).toEqual('Original aspirations');
    expect(result.profile_image_url).toEqual('original-image.jpg');
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update only provided fields in existing profile', async () => {
    // Create initial profile
    const initialProfile = await db.insert(developerProfileTable)
      .values({
        name: 'Test User',
        title: 'Junior Developer',
        bio: 'Learning to code',
        experience_years: 1,
        aspirations: 'Get better at coding',
        profile_image_url: null
      })
      .returning()
      .execute();

    const input: UpdateProfileInput = {
      bio: 'Updated bio content',
      aspirations: null
    };

    const result = await updateProfile(input);

    expect(result.id).toEqual(initialProfile[0].id);
    expect(result.name).toEqual('Test User'); // Unchanged
    expect(result.title).toEqual('Junior Developer'); // Unchanged
    expect(result.bio).toEqual('Updated bio content'); // Updated
    expect(result.experience_years).toEqual(1); // Unchanged
    expect(result.aspirations).toBeNull(); // Updated to null
    expect(result.profile_image_url).toBeNull(); // Unchanged
  });

  it('should save changes to database', async () => {
    const input: UpdateProfileInput = {
      name: 'Database Test',
      title: 'Test Developer',
      bio: 'Testing database operations',
      experience_years: 4
    };

    const result = await updateProfile(input);

    // Verify in database
    const profiles = await db.select()
      .from(developerProfileTable)
      .where(eq(developerProfileTable.id, result.id))
      .execute();

    expect(profiles).toHaveLength(1);
    expect(profiles[0].name).toEqual('Database Test');
    expect(profiles[0].title).toEqual('Test Developer');
    expect(profiles[0].bio).toEqual('Testing database operations');
    expect(profiles[0].experience_years).toEqual(4);
  });

  it('should handle nullable fields correctly', async () => {
    const input: UpdateProfileInput = {
      name: 'Null Test',
      aspirations: null,
      profile_image_url: null
    };

    const result = await updateProfile(input);

    expect(result.aspirations).toBeNull();
    expect(result.profile_image_url).toBeNull();

    // Verify in database
    const profiles = await db.select()
      .from(developerProfileTable)
      .where(eq(developerProfileTable.id, result.id))
      .execute();

    expect(profiles[0].aspirations).toBeNull();
    expect(profiles[0].profile_image_url).toBeNull();
  });
});
