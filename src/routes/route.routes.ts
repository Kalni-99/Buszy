import { FastifyInstance } from 'fastify';
import { RouteController } from '../controllers/route.controller.js';

export async function routeRoutes(fastify: FastifyInstance) {
  const routeController = new RouteController();

  fastify.get('/', (req) => routeController.getAllRoutes(req));
  fastify.get('/:id', (req, reply) => routeController.getRouteById(req, reply));
  
  fastify.post('/', {
    schema: {
      tags: ['Routes'],
      body: {
        type: 'object',
        required: ['routeNumber', 'origin', 'destination', 'distance', 'duration'],
        properties: {
          routeNumber: { type: 'string' },
          origin: { type: 'string' },
          destination: { type: 'string' },
          distance: { type: 'number', minimum: 0 },
          duration: { type: 'number', minimum: 1 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            routeNumber: { type: 'string' },
            origin: { type: 'string' },
            destination: { type: 'string' },
            distance: { type: 'number' },
            duration: { type: 'number' }
          }
        }
      }
    },
    onRequest: [fastify.authenticate]
  }, (req, reply) => routeController.createRoute(req, reply));

  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => routeController.updateRoute(req, reply));
}