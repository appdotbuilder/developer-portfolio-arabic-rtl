
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  updateProfileInputSchema,
  createSkillInputSchema,
  updateSkillInputSchema,
  createProjectInputSchema,
  updateProjectInputSchema,
  createContactMessageInputSchema,
  updateContactInfoInputSchema
} from './schema';

// Import handlers
import { getProfile } from './handlers/get_profile';
import { updateProfile } from './handlers/update_profile';
import { getSkills } from './handlers/get_skills';
import { createSkill } from './handlers/create_skill';
import { updateSkill } from './handlers/update_skill';
import { deleteSkill } from './handlers/delete_skill';
import { getProjects } from './handlers/get_projects';
import { getFeaturedProjects } from './handlers/get_featured_projects';
import { createProject } from './handlers/create_project';
import { updateProject } from './handlers/update_project';
import { deleteProject } from './handlers/delete_project';
import { createContactMessage } from './handlers/create_contact_message';
import { getContactMessages } from './handlers/get_contact_messages';
import { markMessageRead } from './handlers/mark_message_read';
import { getContactInfo } from './handlers/get_contact_info';
import { updateContactInfo } from './handlers/update_contact_info';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Profile routes
  getProfile: publicProcedure
    .query(() => getProfile()),
  updateProfile: publicProcedure
    .input(updateProfileInputSchema)
    .mutation(({ input }) => updateProfile(input)),

  // Skills routes
  getSkills: publicProcedure
    .query(() => getSkills()),
  createSkill: publicProcedure
    .input(createSkillInputSchema)
    .mutation(({ input }) => createSkill(input)),
  updateSkill: publicProcedure
    .input(updateSkillInputSchema)
    .mutation(({ input }) => updateSkill(input)),
  deleteSkill: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteSkill(input.id)),

  // Projects routes
  getProjects: publicProcedure
    .query(() => getProjects()),
  getFeaturedProjects: publicProcedure
    .query(() => getFeaturedProjects()),
  createProject: publicProcedure
    .input(createProjectInputSchema)
    .mutation(({ input }) => createProject(input)),
  updateProject: publicProcedure
    .input(updateProjectInputSchema)
    .mutation(({ input }) => updateProject(input)),
  deleteProject: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteProject(input.id)),

  // Contact routes
  createContactMessage: publicProcedure
    .input(createContactMessageInputSchema)
    .mutation(({ input }) => createContactMessage(input)),
  getContactMessages: publicProcedure
    .query(() => getContactMessages()),
  markMessageRead: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => markMessageRead(input.id)),
  getContactInfo: publicProcedure
    .query(() => getContactInfo()),
  updateContactInfo: publicProcedure
    .input(updateContactInfoInputSchema)
    .mutation(({ input }) => updateContactInfo(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
