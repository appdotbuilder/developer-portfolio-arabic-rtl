
import { db } from '../db';
import { contactMessagesTable } from '../db/schema';
import { type ContactMessage } from '../schema';
import { eq } from 'drizzle-orm';

export async function markMessageRead(id: number): Promise<ContactMessage> {
  try {
    const result = await db.update(contactMessagesTable)
      .set({ 
        is_read: true 
      })
      .where(eq(contactMessagesTable.id, id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Contact message with id ${id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Mark message read failed:', error);
    throw error;
  }
}
