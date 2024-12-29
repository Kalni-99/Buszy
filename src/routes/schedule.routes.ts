import { FastifyInstance } from 'fastify';
import { ScheduleController } from '../controllers/schedule.controller.js';

export async function scheduleRoutes(fastify: FastifyInstance) {
  const scheduleController = new ScheduleController();

  fastify.get('/', (req) => scheduleController.getAllSchedules(req));
  fastify.get('/:id', (req, reply) => scheduleController.getScheduleById(req, reply));
  
  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => scheduleController.createSchedule(req, reply));
  
  fastify.put('/:id', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => scheduleController.updateSchedule(req, reply));
}