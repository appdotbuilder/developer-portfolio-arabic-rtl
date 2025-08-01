
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { createProject } from '../handlers/create_project';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateProjectInput = {
  title: 'Test Project',
  description: 'A comprehensive test project for portfolio demonstration',
  short_description: 'Test project for portfolio',
  technologies_used: '["React", "TypeScript", "Node.js"]',
  live_demo_url: 'https://example.com/demo',
  github_url: 'https://github.com/user/test-project',
  image_url: 'https://example.com/image.jpg',
  display_order: 5,
  is_featured: true
};

describe('createProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a project with all fields', async () => {
    const result = await createProject(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Project');
    expect(result.description).toEqual(testInput.description);
    expect(result.short_description).toEqual(testInput.short_description);
    expect(result.technologies_used).toEqual('["React", "TypeScript", "Node.js"]');
    expect(result.live_demo_url).toEqual('https://example.com/demo');
    expect(result.github_url).toEqual('https://github.com/user/test-project');
    expect(result.image_url).toEqual('https://example.com/image.jpg');
    expect(result.display_order).toEqual(5);
    expect(result.is_featured).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create a project with minimal fields and defaults', async () => {
    const minimalInput: CreateProjectInput = {
      title: 'Minimal Project',
      description: 'A minimal test project',
      short_description: 'Minimal project',
      technologies_used: '["JavaScript"]',
      live_demo_url: null,
      github_url: null,
      image_url: null
      // display_order and is_featured should use defaults
    };

    const result = await createProject(minimalInput);

    expect(result.title).toEqual('Minimal Project');
    expect(result.description).toEqual('A minimal test project');
    expect(result.short_description).toEqual('Minimal project');
    expect(result.technologies_used).toEqual('["JavaScript"]');
    expect(result.live_demo_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.display_order).toEqual(0); // Default value
    expect(result.is_featured).toEqual(false); // Default value
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save project to database', async () => {
    const result = await createProject(testInput);

    // Query using proper drizzle syntax
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toEqual('Test Project');
    expect(projects[0].description).toEqual(testInput.description);
    expect(projects[0].short_description).toEqual(testInput.short_description);
    expect(projects[0].technologies_used).toEqual('["React", "TypeScript", "Node.js"]');
    expect(projects[0].live_demo_url).toEqual('https://example.com/demo');
    expect(projects[0].github_url).toEqual('https://github.com/user/test-project');
    expect(projects[0].image_url).toEqual('https://example.com/image.jpg');
    expect(projects[0].display_order).toEqual(5);
    expect(projects[0].is_featured).toEqual(true);
    expect(projects[0].created_at).toBeInstanceOf(Date);
    expect(projects[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle different display orders correctly', async () => {
    // Create multiple projects with different display orders
    const project1 = await createProject({
      title: 'Project 1',
      description: 'First project description',
      short_description: 'First project',
      technologies_used: '["React"]',
      live_demo_url: null,
      github_url: null,
      image_url: null,
      display_order: 1,
      is_featured: false
    });

    const project2 = await createProject({
      title: 'Project 2',
      description: 'Second project description',
      short_description: 'Second project',
      technologies_used: '["Vue"]',
      live_demo_url: null,
      github_url: null,
      image_url: null,
      display_order: 10,
      is_featured: false
    });

    const project3 = await createProject({
      title: 'Project 3',
      description: 'Third project description',
      short_description: 'Third project',
      technologies_used: '["Angular"]',
      live_demo_url: null,
      github_url: null,
      image_url: null
      // Should use default display_order of 0 and is_featured of false
    });

    expect(project1.display_order).toEqual(1);
    expect(project2.display_order).toEqual(10);
    expect(project3.display_order).toEqual(0);

    // Verify all projects are saved correctly
    const allProjects = await db.select()
      .from(projectsTable)
      .execute();

    expect(allProjects).toHaveLength(3);
    
    const savedProject1 = allProjects.find(p => p.title === 'Project 1');
    const savedProject2 = allProjects.find(p => p.title === 'Project 2');
    const savedProject3 = allProjects.find(p => p.title === 'Project 3');

    expect(savedProject1?.display_order).toEqual(1);
    expect(savedProject2?.display_order).toEqual(10);
    expect(savedProject3?.display_order).toEqual(0);
  });
});
