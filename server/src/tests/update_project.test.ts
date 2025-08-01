
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput, type CreateProjectInput } from '../schema';
import { updateProject } from '../handlers/update_project';
import { eq } from 'drizzle-orm';

// Helper function to create a test project
const createTestProject = async (): Promise<number> => {
  const testProject: CreateProjectInput = {
    title: 'Original Project',
    description: 'Original description',
    short_description: 'Original short description',
    technologies_used: '["JavaScript", "Node.js"]',
    live_demo_url: 'https://original-demo.com',
    github_url: 'https://github.com/original',
    image_url: 'https://original-image.com',
    display_order: 1,
    is_featured: false
  };

  const result = await db.insert(projectsTable)
    .values({
      ...testProject,
      display_order: testProject.display_order || 0,
      is_featured: testProject.is_featured || false
    })
    .returning()
    .execute();

  return result[0].id;
};

describe('updateProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update project fields', async () => {
    const projectId = await createTestProject();

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title: 'Updated Project Title',
      description: 'Updated description',
      is_featured: true
    };

    const result = await updateProject(updateInput);

    expect(result.id).toEqual(projectId);
    expect(result.title).toEqual('Updated Project Title');
    expect(result.description).toEqual('Updated description');
    expect(result.is_featured).toEqual(true);
    expect(result.short_description).toEqual('Original short description'); // Unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update nullable fields to null', async () => {
    const projectId = await createTestProject();

    const updateInput: UpdateProjectInput = {
      id: projectId,
      live_demo_url: null,
      github_url: null,
      image_url: null
    };

    const result = await updateProject(updateInput);

    expect(result.live_demo_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.title).toEqual('Original Project'); // Unchanged
  });

  it('should update display_order and technologies_used', async () => {
    const projectId = await createTestProject();

    const updateInput: UpdateProjectInput = {
      id: projectId,
      display_order: 10,
      technologies_used: '["React", "TypeScript", "Next.js"]'
    };

    const result = await updateProject(updateInput);

    expect(result.display_order).toEqual(10);
    expect(result.technologies_used).toEqual('["React", "TypeScript", "Next.js"]');
  });

  it('should save updated project to database', async () => {
    const projectId = await createTestProject();

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title: 'Database Updated Title',
      is_featured: true
    };

    await updateProject(updateInput);

    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toEqual('Database Updated Title');
    expect(projects[0].is_featured).toEqual(true);
    expect(projects[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update only updated_at when no other fields provided', async () => {
    const projectId = await createTestProject();
    
    // Get original project to compare timestamps
    const originalProject = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();

    // Wait a small amount to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateProjectInput = {
      id: projectId
    };

    const result = await updateProject(updateInput);

    expect(result.title).toEqual('Original Project'); // Unchanged
    expect(result.description).toEqual('Original description'); // Unchanged
    expect(result.updated_at.getTime()).toBeGreaterThan(originalProject[0].updated_at.getTime());
  });

  it('should throw error for non-existent project', async () => {
    const updateInput: UpdateProjectInput = {
      id: 99999,
      title: 'This should fail'
    };

    expect(updateProject(updateInput)).rejects.toThrow(/not found/i);
  });
});
