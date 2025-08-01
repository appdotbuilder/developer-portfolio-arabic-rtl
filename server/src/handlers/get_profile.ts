
import { db } from '../db';
import { developerProfileTable } from '../db/schema';
import { type DeveloperProfile } from '../schema';

export const getProfile = async (): Promise<DeveloperProfile | null> => {
  try {
    const results = await db.select()
      .from(developerProfileTable)
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Profile retrieval failed:', error);
    throw error;
  }
};
