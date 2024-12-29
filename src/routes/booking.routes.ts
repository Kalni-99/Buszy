import { FastifyInstance } from 'fastify';
import { BookingController } from '../controllers/booking.controller.js';

export async function bookingRoutes(fastify: FastifyInstance) {
  const bookingController = new BookingController();

  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => bookingController.create(req, reply));

  fastify.get('/my-bookings', {
    onRequest: [fastify.authenticate],
  }, (req) => bookingController.getUserBookings(req));

  fastify.patch('/:id/cancel', {
    onRequest: [fastify.authenticate],
  }, (req, reply) => bookingController.cancelBooking(req, reply));
}