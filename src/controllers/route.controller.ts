import { FastifyRequest, FastifyReply } from 'fastify';
import { Route } from '../models/Route.js';

export class RouteController {
  async getAllRoutes(request: FastifyRequest) {
    return Route.find();
  }

  async getRouteById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    
    const route = await Route.findById(id).populate({
      path: 'schedules',
      populate: ['bus']
    });

    if (!route) {
      return reply.status(404).send({ error: 'Route not found' });
    }

    return route;
  }

  async createRoute(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    if (user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const route = await Route.create(request.body);
    return route;
  }

  async updateRoute(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    if (user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const { id } = request.params as any;
    const route = await Route.findByIdAndUpdate(id, request.body as Partial<{ createdAt: Date; updatedAt: Date; origin: string; routeNumber: string; destination: string; distance: number; duration: number; }>, { new: true });

    if (!route) {
      return reply.status(404).send({ error: 'Route not found' });
    }

    return route;
  }
}