import { FastifyInstance } from 'fastify';
import { BusController } from '../controllers/bus.controller.js';

export async function busRoutes(fastify: FastifyInstance) {
  const busController = new BusController();

  fastify.get('/', (req) => busController.getAllBuses(req));
  fastify.get('/:id', (req, reply) => busController.getBusById(req, reply));
  
  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => busController.createBus(req, reply));
  
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => busController.updateBus(req, reply));
}