
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { getProjects } from '../handlers/get_projects';

const testProject1: CreateProjectInput = {
  title: 'Project Alpha',
  description: 'A comprehensive web application built with React and Node.js',
  short_description: 'Full-stack web app',
  technologies_used: '["React", "Node.js", "PostgreSQL"]',
  live_demo_url: 'https://project-alpha.com',
  github_url: 'https://github.com/user/project-alpha',
  image_url: 'https://example.com/project-alpha.jpg',
  display_order: 2,
  is_featured: true
};

const testProject2: CreateProjectInput = {
  title: 'Project Beta',
  description: 'A mobile application developed using React Native',
  short_description: 'Mobile app',
  technologies_used: '["React Native", "Expo", "Firebase"]',
  live_demo_url: null,
  github_url: 'https://github.com/user/project-beta',
  image_url: null,
  display_order: 1,
  is_featured: false
};

const testProject3: CreateProjectInput = {
  title: 'Project Gamma',
  description: 'A data visualization dashboard using D3.js',
  short_description: 'Data dashboard',
  technologies_used: '["D3.js", "Vue.js", "Python"]',
  live_demo_url: 'https://project-gamma.com',
  github_url: null,
  image_url: 'https://example.com/project-gamma.jpg',
  display_order: 3,
  is_featured: true
};

describe('getProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no projects exist', async () => {
    const result = await getProjects();
    expect(result).toEqual([]);
  });

  it('should fetch all projects', async () => {
    // Create test projects
    await db.insert(projectsTable)
      .values([testProject1, testProject2, testProject3])
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(3);
    
    // Verify all projects are returned
    const titles = result.map(p => p.title);
    expect(titles).toContain('Project Alpha');
    expect(titles).toContain('Project Beta');
    expect(titles).toContain('Project Gamma');
  });

  it('should return projects ordered by display_order', async () => {
    // Create test projects
    await db.insert(projectsTable)
      .values([testProject1, testProject2, testProject3])
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(3);
    
    // Verify order by display_order (1, 2, 3)
    expect(result[0].title).toEqual('Project Beta'); // display_order: 1
    expect(result[1].title).toEqual('Project Alpha'); // display_order: 2
    expect(result[2].title).toEqual('Project Gamma'); // display_order: 3
    
    // Verify display_order values
    expect(result[0].display_order).toEqual(1);
    expect(result[1].display_order).toEqual(2);
    expect(result[2].display_order).toEqual(3);
  });

  it('should include all project fields', async () => {
    await db.insert(projectsTable)
      .values(testProject1)
      .execute();

    const result = await getProjects();
    const project = result[0];

    // Verify all fields are present
    expect(project.id).toBeDefined();
    expect(project.title).toEqual('Project Alpha');
    expect(project.description).toEqual('A comprehensive web application built with React and Node.js');
    expect(project.short_description).toEqual('Full-stack web app');
    expect(project.technologies_used).toEqual('["React", "Node.js", "PostgreSQL"]');
    expect(project.live_demo_url).toEqual('https://project-alpha.com');
    expect(project.github_url).toEqual('https://github.com/user/project-alpha');
    expect(project.image_url).toEqual('https://example.com/project-alpha.jpg');
    expect(project.display_order).toEqual(2);
    expect(project.is_featured).toEqual(true);
    expect(project.created_at).toBeInstanceOf(Date);
    expect(project.updated_at).toBeInstanceOf(Date);
  });

  it('should handle projects with null values', async () => {
    await db.insert(projectsTable)
      .values(testProject2)
      .execute();

    const result = await getProjects();
    const project = result[0];

    expect(project.title).toEqual('Project Beta');
    expect(project.live_demo_url).toBeNull();
    expect(project.image_url).toBeNull();
    expect(project.is_featured).toEqual(false);
  });
});
