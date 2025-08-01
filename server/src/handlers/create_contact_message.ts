
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type CreateContactMessageInput, type ContactMessage } from '../schema';

export const createContactMessage = async (input: CreateContactMessageInput): Promise<ContactMessage> => {
  try {
    // Insert contact message record
    const result = await db.insert(contactMessagesTable)
      .values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message
        // is_read defaults to false in the schema
        // created_at defaults to now() in the schema
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Contact message creation failed:', error);
    throw error;
  }
};
