
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { getFeaturedProjects } from '../handlers/get_featured_projects';

describe('getFeaturedProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return only featured projects', async () => {
    // Create test projects - one featured, one not
    await db.insert(projectsTable).values([
      {
        title: 'Featured Project',
        description: 'A featured project description',
        short_description: 'Featured project',
        technologies_used: '["React", "TypeScript"]',
        is_featured: true,
        display_order: 1
      },
      {
        title: 'Regular Project',
        description: 'A regular project description',
        short_description: 'Regular project',
        technologies_used: '["Vue", "JavaScript"]',
        is_featured: false,
        display_order: 2
      }
    ]).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Featured Project');
    expect(result[0].is_featured).toBe(true);
    expect(result[0].description).toEqual('A featured project description');
    expect(result[0].technologies_used).toEqual('["React", "TypeScript"]');
  });

  it('should return empty array when no featured projects exist', async () => {
    // Create only non-featured projects
    await db.insert(projectsTable).values([
      {
        title: 'Regular Project 1',
        description: 'A regular project description',
        short_description: 'Regular project',
        technologies_used: '["Angular"]',
        is_featured: false,
        display_order: 1
      },
      {
        title: 'Regular Project 2',
        description: 'Another regular project description', 
        short_description: 'Another regular project',
        technologies_used: '["Svelte"]',
        is_featured: false,
        display_order: 2
      }
    ]).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(0);
  });

  it('should return multiple featured projects ordered by display_order', async () => {
    // Create multiple featured projects with different display orders
    await db.insert(projectsTable).values([
      {
        title: 'Third Featured Project',
        description: 'Third project description',
        short_description: 'Third project',
        technologies_used: '["Python"]',
        is_featured: true,
        display_order: 3
      },
      {
        title: 'First Featured Project',
        description: 'First project description',
        short_description: 'First project', 
        technologies_used: '["React"]',
        is_featured: true,
        display_order: 1
      },
      {
        title: 'Second Featured Project',
        description: 'Second project description',
        short_description: 'Second project',
        technologies_used: '["Vue"]',
        is_featured: true,
        display_order: 2
      }
    ]).execute();

    const result = await getFeaturedProjects();

    expect(result).toHaveLength(3);
    expect(result[0].title).toEqual('First Featured Project');
    expect(result[0].display_order).toEqual(1);
    expect(result[1].title).toEqual('Second Featured Project');
    expect(result[1].display_order).toEqual(2);
    expect(result[2].title).toEqual('Third Featured Project');
    expect(result[2].display_order).toEqual(3);
  });

  it('should include all project fields', async () => {
    await db.insert(projectsTable).values({
      title: 'Complete Featured Project',
      description: 'A complete project with all fields',
      short_description: 'Complete project',
      technologies_used: '["React", "Node.js", "PostgreSQL"]',
      live_demo_url: 'https://example.com/demo',
      github_url: 'https://github.com/user/project',
      image_url: 'https://example.com/image.jpg',
      is_featured: true,
      display_order: 1
    }).execute();

    const result = await getFeaturedProjects();

    const project = result[0];
    expect(project.id).toBeDefined();
    expect(project.title).toEqual('Complete Featured Project');
    expect(project.description).toEqual('A complete project with all fields');
    expect(project.short_description).toEqual('Complete project');
    expect(project.technologies_used).toEqual('["React", "Node.js", "PostgreSQL"]');
    expect(project.live_demo_url).toEqual('https://example.com/demo');
    expect(project.github_url).toEqual('https://github.com/user/project');
    expect(project.image_url).toEqual('https://example.com/image.jpg');
    expect(project.is_featured).toBe(true);
    expect(project.display_order).toEqual(1);
    expect(project.created_at).toBeInstanceOf(Date);
    expect(project.updated_at).toBeInstanceOf(Date);
  });
});
