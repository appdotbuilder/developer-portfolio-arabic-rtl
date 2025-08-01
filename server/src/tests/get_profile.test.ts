
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { developerProfileTable } from '../db/schema';
import { getProfile } from '../handlers/get_profile';

const testProfile = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  bio: 'Passionate developer with 5 years of experience',
  experience_years: 5,
  aspirations: 'Build amazing web applications',
  profile_image_url: 'https://example.com/profile.jpg'
};

describe('getProfile', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no profile exists', async () => {
    const result = await getProfile();
    expect(result).toBeNull();
  });

  it('should return the profile when one exists', async () => {
    // Create a profile first
    await db.insert(developerProfileTable)
      .values(testProfile)
      .execute();

    const result = await getProfile();
    
    expect(result).not.toBeNull();
    expect(result!.name).toEqual('John Doe');
    expect(result!.title).toEqual('Full Stack Developer');
    expect(result!.bio).toEqual('Passionate developer with 5 years of experience');
    expect(result!.experience_years).toEqual(5);
    expect(result!.aspirations).toEqual('Build amazing web applications');
    expect(result!.profile_image_url).toEqual('https://example.com/profile.jpg');
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return only the first profile when multiple exist', async () => {
    // Create multiple profiles
    await db.insert(developerProfileTable)
      .values([
        { ...testProfile, name: 'First Profile' },
        { ...testProfile, name: 'Second Profile' }
      ])
      .execute();

    const result = await getProfile();
    
    expect(result).not.toBeNull();
    expect(result!.name).toEqual('First Profile');
  });

  it('should handle null aspirations correctly', async () => {
    const profileWithNullAspirations = {
      ...testProfile,
      aspirations: null
    };

    await db.insert(developerProfileTable)
      .values(profileWithNullAspirations)
      .execute();

    const result = await getProfile();
    
    expect(result).not.toBeNull();
    expect(result!.aspirations).toBeNull();
  });
});
