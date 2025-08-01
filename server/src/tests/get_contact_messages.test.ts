
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput } from '../schema';
import { getContactMessages } from '../handlers/get_contact_messages';

// Test message data
const testMessage1: CreateContactMessageInput = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss a potential project.'
};

const testMessage2: CreateContactMessageInput = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  subject: null,
  message: 'Hello, I am interested in your services.'
};

describe('getContactMessages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no messages exist', async () => {
    const result = await getContactMessages();

    expect(result).toEqual([]);
  });

  it('should return all contact messages', async () => {
    // Create test messages
    await db.insert(contactMessagesTable)
      .values([
        {
          name: testMessage1.name,
          email: testMessage1.email,
          subject: testMessage1.subject,
          message: testMessage1.message
        },
        {
          name: testMessage2.name,
          email: testMessage2.email,
          subject: testMessage2.subject,
          message: testMessage2.message
        }
      ])
      .execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    
    // Verify message data
    const johnMessage = result.find(m => m.name === 'John Doe');
    const janeMessage = result.find(m => m.name === 'Jane Smith');

    expect(johnMessage).toBeDefined();
    expect(johnMessage!.email).toEqual('john@example.com');
    expect(johnMessage!.subject).toEqual('Project Inquiry');
    expect(johnMessage!.message).toEqual('I would like to discuss a potential project.');
    expect(johnMessage!.is_read).toEqual(false);
    expect(johnMessage!.created_at).toBeInstanceOf(Date);

    expect(janeMessage).toBeDefined();
    expect(janeMessage!.email).toEqual('jane@example.com');
    expect(janeMessage!.subject).toBeNull();
    expect(janeMessage!.message).toEqual('Hello, I am interested in your services.');
    expect(janeMessage!.is_read).toEqual(false);
    expect(janeMessage!.created_at).toBeInstanceOf(Date);
  });

  it('should return messages ordered by creation date (newest first)', async () => {
    // Create messages with slight delay to ensure different timestamps
    await db.insert(contactMessagesTable)
      .values({
        name: 'First Message',
        email: 'first@example.com',
        subject: 'First',
        message: 'This was sent first.'
      })
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(contactMessagesTable)
      .values({
        name: 'Second Message',
        email: 'second@example.com',
        subject: 'Second',
        message: 'This was sent second.'
      })
      .execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    
    // Most recent message should be first
    expect(result[0].name).toEqual('Second Message');
    expect(result[1].name).toEqual('First Message');
    
    // Verify ordering by timestamp
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should handle messages with different read statuses', async () => {
    // Create a read message
    await db.insert(contactMessagesTable)
      .values({
        name: 'Read Message',
        email: 'read@example.com',
        subject: 'Read Subject',
        message: 'This message has been read.',
        is_read: true
      })
      .execute();

    // Create an unread message
    await db.insert(contactMessagesTable)
      .values({
        name: 'Unread Message',
        email: 'unread@example.com',
        subject: 'Unread Subject',
        message: 'This message is unread.'
      })
      .execute();

    const result = await getContactMessages();

    expect(result).toHaveLength(2);
    
    const readMessage = result.find(m => m.name === 'Read Message');
    const unreadMessage = result.find(m => m.name === 'Unread Message');

    expect(readMessage!.is_read).toEqual(true);
    expect(unreadMessage!.is_read).toEqual(false);
  });
});
