import { FastifyInstance } from 'fastify';
import { BusController } from '../controllers/bus.controller.js';
import { BusType } from '../models/Bus.js';

export async function busRoutes(fastify: FastifyInstance) {
  const busController = new BusController();


  fastify.get('/:id',{
    schema: {
      tags: ['Buses'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        }
      }
    },
  }, (req, reply) => busController.getBusById(req, reply));
  
  fastify.get('/', {
    schema: {
      tags: ['Buses'],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              plateNumber: { type: 'string' },
              capacity: { type: 'number' },
              type: { type: 'string', enum: Object.values(BusType) },
              operator: { type: 'string' }
            }
          }
        }
      }
    }
  }, (req) => busController.getAllBuses(req));

  fastify.post('/', {
    schema: {
      tags: ['Buses'],
      body: {
        type: 'object',
        required: ['plateNumber', 'capacity', 'type', 'operator'],
        properties: {
          plateNumber: { type: 'string' },
          capacity: { type: 'number', minimum: 1 },
          type: { type: 'string', enum: Object.values(BusType) },
          operator: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            plateNumber: { type: 'string' },
            capacity: { type: 'number' },
            type: { type: 'string' },
            operator: { type: 'string' }
          }
        }
      }
    },
    //onRequest: [fastify.authenticate]
  }, (req, reply) => busController.createBus(req, reply));

  fastify.put('/:id', {
    schema: {
      tags: ['Buses'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['plateNumber', 'capacity', 'type', 'operator'],
        properties: {
          plateNumber: { type: 'string' },
          capacity: { type: 'number', minimum: 1 },
          type: { type: 'string', enum: Object.values(BusType) },
          operator: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            plateNumber: { type: 'string' },
            capacity: { type: 'number' },
            type: { type: 'string' },
            operator: { type: 'string' }
          }
        }
      }
    },
    //onRequest: [fastify.authenticate],
  }, (req, reply) => busController.updateBus(req, reply));
}