
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { getContactInfo } from '../handlers/get_contact_info';

describe('getContactInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no contact info exists', async () => {
    const result = await getContactInfo();
    expect(result).toBeNull();
  });

  it('should return contact info when it exists', async () => {
    // Create test contact info
    const testContactInfo = {
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'San Francisco, CA',
      linkedin_url: 'https://linkedin.com/in/johndoe',
      github_url: 'https://github.com/johndoe',
      twitter_url: 'https://twitter.com/johndoe',
      website_url: 'https://johndoe.dev'
    };

    await db.insert(contactInfoTable)
      .values(testContactInfo)
      .execute();

    const result = await getContactInfo();

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('john@example.com');
    expect(result!.phone).toEqual('+1234567890');
    expect(result!.location).toEqual('San Francisco, CA');
    expect(result!.linkedin_url).toEqual('https://linkedin.com/in/johndoe');
    expect(result!.github_url).toEqual('https://github.com/johndoe');
    expect(result!.twitter_url).toEqual('https://twitter.com/johndoe');
    expect(result!.website_url).toEqual('https://johndoe.dev');
    expect(result!.id).toBeDefined();
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return first contact info when multiple exist', async () => {
    // Create multiple contact info records
    await db.insert(contactInfoTable)
      .values([
        {
          email: 'first@example.com',
          phone: '+1111111111',
          location: 'First Location'
        },
        {
          email: 'second@example.com',
          phone: '+2222222222',
          location: 'Second Location'
        }
      ])
      .execute();

    const result = await getContactInfo();

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('first@example.com');
    expect(result!.phone).toEqual('+1111111111');
    expect(result!.location).toEqual('First Location');
  });

  it('should handle nullable fields correctly', async () => {
    // Create contact info with only required fields
    await db.insert(contactInfoTable)
      .values({
        email: 'minimal@example.com'
      })
      .execute();

    const result = await getContactInfo();

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('minimal@example.com');
    expect(result!.phone).toBeNull();
    expect(result!.location).toBeNull();
    expect(result!.linkedin_url).toBeNull();
    expect(result!.github_url).toBeNull();
    expect(result!.twitter_url).toBeNull();
    expect(result!.website_url).toBeNull();
  });
});
