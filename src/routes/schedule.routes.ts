import { FastifyInstance } from 'fastify';
import { ScheduleController } from '../controllers/schedule.controller.js';

export async function scheduleRoutes(fastify: FastifyInstance) {
  const scheduleController = new ScheduleController();

  fastify.get('/', (req) => scheduleController.getAllSchedules(req));
  fastify.get('/:id', (req, reply) => scheduleController.getScheduleById(req, reply));
  
  fastify.post('/', {
    schema: {
      tags: ['Schedules'],
      body: {
        type: 'object',
        required: ['route', 'bus', 'departure', 'arrival', 'price'],
        properties: {
          route: { type: 'string', description: 'Route ID' },
          bus: { type: 'string', description: 'Bus ID' },
          departure: { type: 'string', format: 'date-time' },
          arrival: { type: 'string', format: 'date-time' },
          price: { type: 'number', minimum: 0 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            route: { 
              type: 'object',
              properties: {
                id: { type: 'string' },
                routeNumber: { type: 'string' },
                origin: { type: 'string' },
                destination: { type: 'string' }
              }
            },
            bus: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                plateNumber: { type: 'string' },
                type: { type: 'string' }
              }
            },
            departure: { type: 'string', format: 'date-time' },
            arrival: { type: 'string', format: 'date-time' },
            price: { type: 'number' }
          }
        }
      }
    },
   // onRequest: [fastify.authenticate]
  }, (req, reply) => scheduleController.createSchedule(req, reply));

  fastify.put('/:id', {
   // onRequest: [fastify.authenticate],
  }, (req, reply) => scheduleController.updateSchedule(req, reply));
}