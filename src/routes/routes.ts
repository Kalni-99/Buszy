import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const routeSchema = z.object({
  routeNumber: z.string(),
  origin: z.string(),
  destination: z.string(),
  distance: z.number(),
  duration: z.number(),
});

export async function routeRoutes(fastify: FastifyInstance) {
  // Get all routes
  fastify.get('/', async () => {
    return prisma.route.findMany();
  });

  // Get route by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        schedules: {
          include: {
            bus: true,
          },
        },
      },
    });

    if (!route) {
      return reply.status(404).send({ error: 'Route not found' });
    }

    return route;
  });

  // Create new route (admin only)
  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const user = request.user as { role: string };
    if (user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const body = routeSchema.parse(request.body);
    
    return prisma.route.create({
      data: body,
    });
  });

  // Update route (admin only)
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const user = request.user as { role: string };
    if (user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as { id: string };
    const body = routeSchema.parse(request.body);
    
    return prisma.route.update({
      where: { id },
      data: body,
    });
  });
}