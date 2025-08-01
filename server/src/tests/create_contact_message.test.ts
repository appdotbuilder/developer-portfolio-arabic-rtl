
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput } from '../schema';
import { createContactMessage } from '../handlers/create_contact_message';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateContactMessageInput = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Test Subject',
  message: 'This is a test message for the contact form.'
};

// Test input without optional subject
const testInputNoSubject: CreateContactMessageInput = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  subject: null,
  message: 'This is a test message without a subject.'
};

describe('createContactMessage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a contact message with subject', async () => {
    const result = await createContactMessage(testInput);

    // Basic field validation
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john.doe@example.com');
    expect(result.subject).toEqual('Test Subject');
    expect(result.message).toEqual(testInput.message);
    expect(result.is_read).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a contact message without subject', async () => {
    const result = await createContactMessage(testInputNoSubject);

    // Basic field validation
    expect(result.name).toEqual('Jane Smith');
    expect(result.email).toEqual('jane.smith@example.com');
    expect(result.subject).toBeNull();
    expect(result.message).toEqual(testInputNoSubject.message);
    expect(result.is_read).toEqual(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save contact message to database', async () => {
    const result = await createContactMessage(testInput);

    // Query database to verify record was saved
    const contactMessages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, result.id))
      .execute();

    expect(contactMessages).toHaveLength(1);
    expect(contactMessages[0].name).toEqual('John Doe');
    expect(contactMessages[0].email).toEqual('john.doe@example.com');
    expect(contactMessages[0].subject).toEqual('Test Subject');
    expect(contactMessages[0].message).toEqual(testInput.message);
    expect(contactMessages[0].is_read).toEqual(false);
    expect(contactMessages[0].created_at).toBeInstanceOf(Date);
  });

  it('should have correct default values', async () => {
    const result = await createContactMessage(testInput);

    // Verify defaults are applied correctly
    expect(result.is_read).toEqual(false);
    expect(result.created_at).toBeInstanceOf(Date);
    
    // Verify the created_at timestamp is recent (within last minute)
    const now = new Date();
    const timeDiff = now.getTime() - result.created_at.getTime();
    expect(timeDiff).toBeLessThan(60000); // Less than 1 minute
  });
});
