
import { db } from '../db';
import { developerProfileTable } from '../db/schema';
import { type UpdateProfileInput, type DeveloperProfile } from '../schema';
import { eq } from 'drizzle-orm';

export const updateProfile = async (input: UpdateProfileInput): Promise<DeveloperProfile> => {
  try {
    // Check if a profile already exists
    const existingProfiles = await db.select()
      .from(developerProfileTable)
      .limit(1)
      .execute();

    if (existingProfiles.length > 0) {
      // Update existing profile
      const profileId = existingProfiles[0].id;
      
      // Build update object with only provided fields
      const updateData: any = {
        updated_at: new Date()
      };
      
      if (input.name !== undefined) updateData['name'] = input.name;
      if (input.title !== undefined) updateData['title'] = input.title;
      if (input.bio !== undefined) updateData['bio'] = input.bio;
      if (input.experience_years !== undefined) updateData['experience_years'] = input.experience_years;
      if (input.aspirations !== undefined) updateData['aspirations'] = input.aspirations;
      if (input.profile_image_url !== undefined) updateData['profile_image_url'] = input.profile_image_url;

      const result = await db.update(developerProfileTable)
        .set(updateData)
        .where(eq(developerProfileTable.id, profileId))
        .returning()
        .execute();

      return result[0];
    } else {
      // Create new profile - all required fields must have values
      const result = await db.insert(developerProfileTable)
        .values({
          name: input.name || 'Developer',
          title: input.title || 'Software Developer',
          bio: input.bio || 'Passionate developer building amazing things.',
          experience_years: input.experience_years || 0,
          aspirations: input.aspirations,
          profile_image_url: input.profile_image_url
        })
        .returning()
        .execute();

      return result[0];
    }
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};
