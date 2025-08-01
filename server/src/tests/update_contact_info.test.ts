
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { type UpdateContactInfoInput } from '../schema';
import { updateContactInfo } from '../handlers/update_contact_info';

const testInput: UpdateContactInfoInput = {
  email: 'john@example.com',
  phone: '+1-555-0123',
  location: 'San Francisco, CA',
  linkedin_url: 'https://linkedin.com/in/john',
  github_url: 'https://github.com/john',
  twitter_url: 'https://twitter.com/john',
  website_url: 'https://johndev.com'
};

describe('updateContactInfo', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create new contact info when none exists', async () => {
    const result = await updateContactInfo(testInput);

    // Verify returned data
    expect(result.email).toEqual('john@example.com');
    expect(result.phone).toEqual('+1-555-0123');
    expect(result.location).toEqual('San Francisco, CA');
    expect(result.linkedin_url).toEqual('https://linkedin.com/in/john');
    expect(result.github_url).toEqual('https://github.com/john');
    expect(result.twitter_url).toEqual('https://twitter.com/john');
    expect(result.website_url).toEqual('https://johndev.com');
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save new contact info to database', async () => {
    const result = await updateContactInfo(testInput);

    const contactInfo = await db.select()
      .from(contactInfoTable)
      .execute();

    expect(contactInfo).toHaveLength(1);
    expect(contactInfo[0].email).toEqual('john@example.com');
    expect(contactInfo[0].phone).toEqual('+1-555-0123');
    expect(contactInfo[0].id).toEqual(result.id);
  });

  it('should update existing contact info', async () => {
    // First create contact info
    await updateContactInfo(testInput);

    // Update with new data
    const updateInput: UpdateContactInfoInput = {
      email: 'jane@example.com',
      phone: '+1-555-9999',
      location: 'New York, NY'
    };

    const result = await updateContactInfo(updateInput);

    // Verify updated fields
    expect(result.email).toEqual('jane@example.com');
    expect(result.phone).toEqual('+1-555-9999');
    expect(result.location).toEqual('New York, NY');
    // Previous fields should remain unchanged when not provided
    expect(result.linkedin_url).toEqual('https://linkedin.com/in/john');
    expect(result.github_url).toEqual('https://github.com/john');
  });

  it('should handle partial updates correctly', async () => {
    // Create initial contact info
    await updateContactInfo(testInput);

    // Update only email and phone
    const partialUpdate: UpdateContactInfoInput = {
      email: 'updated@example.com',
      phone: null // Explicitly set to null
    };

    const result = await updateContactInfo(partialUpdate);

    expect(result.email).toEqual('updated@example.com');
    expect(result.phone).toBeNull();
    // Other fields should remain unchanged
    expect(result.location).toEqual('San Francisco, CA');
    expect(result.linkedin_url).toEqual('https://linkedin.com/in/john');
  });

  it('should create with default email when no email provided', async () => {
    const inputWithoutEmail: UpdateContactInfoInput = {
      phone: '+1-555-0123',
      location: 'Test City'
    };

    const result = await updateContactInfo(inputWithoutEmail);

    expect(result.email).toEqual('developer@example.com');
    expect(result.phone).toEqual('+1-555-0123');
    expect(result.location).toEqual('Test City');
  });

  it('should ensure only one contact info record exists', async () => {
    // Create first record
    await updateContactInfo(testInput);

    // Update again - should still be one record
    await updateContactInfo({
      email: 'new@example.com'
    });

    const allContactInfo = await db.select()
      .from(contactInfoTable)
      .execute();

    expect(allContactInfo).toHaveLength(1);
    expect(allContactInfo[0].email).toEqual('new@example.com');
  });
});
