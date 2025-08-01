
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { deleteProject } from '../handlers/delete_project';
import { eq } from 'drizzle-orm';

// Test project data
const testProject: CreateProjectInput = {
  title: 'Test Project',
  description: 'A detailed description of the test project',
  short_description: 'A test project',
  technologies_used: '["React", "TypeScript", "Node.js"]',
  live_demo_url: 'https://example.com',
  github_url: 'https://github.com/user/test-project',
  image_url: 'https://example.com/image.jpg',
  display_order: 1,
  is_featured: true
};

describe('deleteProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing project', async () => {
    // Create a project first
    const result = await db.insert(projectsTable)
      .values({
        title: testProject.title,
        description: testProject.description,
        short_description: testProject.short_description,
        technologies_used: testProject.technologies_used,
        live_demo_url: testProject.live_demo_url,
        github_url: testProject.github_url,
        image_url: testProject.image_url,
        display_order: testProject.display_order ?? 0,
        is_featured: testProject.is_featured ?? false
      })
      .returning()
      .execute();

    const projectId = result[0].id;

    // Verify project exists
    const beforeDelete = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();
    expect(beforeDelete).toHaveLength(1);

    // Delete the project
    await deleteProject(projectId);

    // Verify project no longer exists
    const afterDelete = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();
    expect(afterDelete).toHaveLength(0);
  });

  it('should not throw error when deleting non-existent project', async () => {
    // Try to delete a project that doesn't exist
    const nonExistentId = 999;

    // Should not throw an error
    await expect(deleteProject(nonExistentId)).resolves.toBeUndefined();
  });

  it('should only delete the specified project', async () => {
    // Create two projects
    const project1 = await db.insert(projectsTable)
      .values({
        title: 'Project 1',
        description: 'First project description',
        short_description: 'First project',
        technologies_used: '["React"]',
        display_order: 0,
        is_featured: false
      })
      .returning()
      .execute();

    const project2 = await db.insert(projectsTable)
      .values({
        title: 'Project 2',
        description: 'Second project description',
        short_description: 'Second project',
        technologies_used: '["Vue"]',
        display_order: 0,
        is_featured: false
      })
      .returning()
      .execute();

    // Delete only the first project
    await deleteProject(project1[0].id);

    // Verify first project is deleted
    const deletedProject = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, project1[0].id))
      .execute();
    expect(deletedProject).toHaveLength(0);

    // Verify second project still exists
    const remainingProject = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, project2[0].id))
      .execute();
    expect(remainingProject).toHaveLength(1);
    expect(remainingProject[0].title).toEqual('Project 2');
  });
});
