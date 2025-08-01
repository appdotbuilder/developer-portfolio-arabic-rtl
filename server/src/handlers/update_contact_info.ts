
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { type UpdateContactInfoInput, type ContactInfo } from '../schema';
import { sql } from 'drizzle-orm';

export const updateContactInfo = async (input: UpdateContactInfoInput): Promise<ContactInfo> => {
  try {
    // Check if contact info already exists
    const existing = await db.select()
      .from(contactInfoTable)
      .limit(1)
      .execute();

    if (existing.length > 0) {
      // Update existing record
      const result = await db.update(contactInfoTable)
        .set({
          ...input,
          updated_at: sql`now()`
        })
        .returning()
        .execute();

      return result[0];
    } else {
      // Create new record with provided data and required defaults
      const result = await db.insert(contactInfoTable)
        .values({
          email: input.email || 'developer@example.com',
          phone: input.phone || null,
          location: input.location || null,
          linkedin_url: input.linkedin_url || null,
          github_url: input.github_url || null,
          twitter_url: input.twitter_url || null,
          website_url: input.website_url || null
        })
        .returning()
        .execute();

      return result[0];
    }
  } catch (error) {
    console.error('Contact info update failed:', error);
    throw error;
  }
};
