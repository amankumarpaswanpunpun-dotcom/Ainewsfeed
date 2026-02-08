import { z } from 'zod';
import { insertPostSchema, posts } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts' as const,
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts' as const,
      input: insertPostSchema,
      responses: {
        201: z.custom<typeof posts.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news' as const,
      responses: {
        200: z.array(z.object({
          source: z.object({ id: z.string().nullable(), name: z.string() }).optional(),
          author: z.string().nullable().optional(),
          title: z.string(),
          description: z.string().nullable().optional(),
          url: z.string(),
          urlToImage: z.string().nullable().optional(),
          publishedAt: z.string(),
          content: z.string().nullable().optional(),
        })),
      },
    },
  }
};
