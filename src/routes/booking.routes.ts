import { FastifyInstance } from 'fastify';
import { BookingController } from '../controllers/booking.controller.js';
import { BookingStatus } from '../models/Booking.js';

export async function bookingRoutes(fastify: FastifyInstance) {
  const bookingController = new BookingController();

  fastify.post('/', {
    schema: {
      tags: ['Bookings'],
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
    //onRequest: [fastify.authenticate]
  }, (req, reply) => bookingController.create(req, reply));

  fastify.get('/my-bookings', {
   // onRequest: [fastify.authenticate],
  }, (req) => bookingController.getUserBookings(req));

  fastify.patch('/:id/cancel', {
    //onRequest: [fastify.authenticate],
  }, (req, reply) => bookingController.cancelBooking(req, reply));
}