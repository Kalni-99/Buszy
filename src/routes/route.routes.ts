import { FastifyInstance } from 'fastify';
import { RouteController } from '../controllers/route.controller.js';

export async function routeRoutes(fastify: FastifyInstance) {
  const routeController = new RouteController();

  fastify.get('/', (req) => routeController.getAllRoutes(req));
  fastify.get('/:id', (req, reply) => routeController.getRouteById(req, reply));
  
  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => routeController.createRoute(req, reply));
  
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => routeController.updateRoute(req, reply));
}