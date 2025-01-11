import { FastifyInstance } from 'fastify';
import { BookingController } from '../controllers/booking.controller.js';
import { BookingStatus } from '../models/Booking.js';

export async function bookingRoutes(fastify: FastifyInstance) {
  const bookingController = new BookingController();

  fastify.post('/', {
    schema: {
      tags: ['Bookings'],
      security: [{ Bearer: [] }],
      body: {
        type: 'object',
        required: ['scheduleId', 'seatNumber'],
        properties: {
          scheduleId: { type: 'string', description: 'Schedule ID' },
          seatNumber: { type: 'number', minimum: 1 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            user: { type: 'string' },
            schedule: { 
              type: 'object',
              properties: {
                id: { type: 'string' },
                departure: { type: 'string', format: 'date-time' },
                arrival: { type: 'string', format: 'date-time' },
                route: {
                  type: 'object',
                  properties: {
                    routeNumber: { type: 'string' },
                    origin: { type: 'string' },
                    destination: { type: 'string' }
                  }
                }
              }
            },
            seatNumber: { type: 'number' },
            status: { type: 'string', enum: Object.values(BookingStatus) }
          }
        }
      }
    },
    onRequest: [fastify.authenticate]
  }, (req, reply) => bookingController.create(req, reply));

  fastify.get('/my-bookings', {
    schema: {
      tags: ['Bookings'],
      security: [{ Bearer: [] }],
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              routeNumber: { type: 'string' },
              origin: { type: 'string' },
              destination: { type: 'string' },
              seatNumber: { type: 'number' },
              status: { type: 'string', enum: Object.values(BookingStatus) },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        }
      }
    },
    onRequest: [fastify.authenticate],
  }, (req) => bookingController.getUserBookings(req));

  fastify.patch('/:id/cancel', {
    schema: {
      tags: ['Bookings'],
      security: [{ Bearer: [] }],
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
    onRequest: [fastify.authenticate],
  }, (req, reply) => bookingController.cancelBooking(req, reply));
}