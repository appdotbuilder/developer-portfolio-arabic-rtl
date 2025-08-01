
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput } from '../schema';
import { markMessageRead } from '../handlers/mark_message_read';
import { eq } from 'drizzle-orm';

const testMessage: CreateContactMessageInput = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test Subject',
  message: 'This is a test message'
};

describe('markMessageRead', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should mark a message as read', async () => {
    // Create a test message first
    const createResult = await db.insert(contactMessagesTable)
      .values({
        name: testMessage.name,
        email: testMessage.email,
        subject: testMessage.subject,
        message: testMessage.message
      })
      .returning()
      .execute();

    const messageId = createResult[0].id;

    // Mark the message as read
    const result = await markMessageRead(messageId);

    // Verify the result
    expect(result.id).toEqual(messageId);
    expect(result.name).toEqual('John Doe');
    expect(result.email).toEqual('john@example.com');
    expect(result.subject).toEqual('Test Subject');
    expect(result.message).toEqual('This is a test message');
    expect(result.is_read).toBe(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update message in database', async () => {
    // Create a test message first
    const createResult = await db.insert(contactMessagesTable)
      .values({
        name: testMessage.name,
        email: testMessage.email,
        subject: testMessage.subject,
        message: testMessage.message
      })
      .returning()
      .execute();

    const messageId = createResult[0].id;

    // Verify initial state is unread
    expect(createResult[0].is_read).toBe(false);

    // Mark the message as read
    await markMessageRead(messageId);

    // Query database to verify the update
    const updatedMessages = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, messageId))
      .execute();

    expect(updatedMessages).toHaveLength(1);
    expect(updatedMessages[0].is_read).toBe(true);
    expect(updatedMessages[0].name).toEqual('John Doe');
  });

  it('should throw error for non-existent message', async () => {
    const nonExistentId = 999;

    await expect(markMessageRead(nonExistentId))
      .rejects.toThrow(/Contact message with id 999 not found/i);
  });

  it('should not affect other messages', async () => {
    // Create two test messages
    const message1Result = await db.insert(contactMessagesTable)
      .values({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'First Message',
        message: 'First test message'
      })
      .returning()
      .execute();

    const message2Result = await db.insert(contactMessagesTable)
      .values({
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Second Message',
        message: 'Second test message'
      })
      .returning()
      .execute();

    const message1Id = message1Result[0].id;
    const message2Id = message2Result[0].id;

    // Mark only the first message as read
    await markMessageRead(message1Id);

    // Verify first message is read
    const message1Updated = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, message1Id))
      .execute();

    expect(message1Updated[0].is_read).toBe(true);

    // Verify second message is still unread
    const message2Updated = await db.select()
      .from(contactMessagesTable)
      .where(eq(contactMessagesTable.id, message2Id))
      .execute();

    expect(message2Updated[0].is_read).toBe(false);
  });
});
