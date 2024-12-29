import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

const bookingSchema = z.object({
  scheduleId: z.string(),
  seatNumber: z.number(),
});

export async function bookingRoutes(fastify: FastifyInstance) {
  // Create booking
  fastify.post('/', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const user = request.user as { id: string };
    const body = bookingSchema.parse(request.body);

    // Check if seat is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        scheduleId: body.scheduleId,
        seatNumber: body.seatNumber,
        status: 'CONFIRMED',
      },
    });

    if (existingBooking) {
      return reply.status(400).send({ error: 'Seat already booked' });
    }

    return prisma.booking.create({
      data: {
        userId: user.id,
        ...body,
        status: 'CONFIRMED',
      },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
          },
        },
      },
    });
  });

  // Get user bookings
  fastify.get('/my-bookings', {
    onRequest: [fastify.authenticate],
  }, async (request) => {
    const user = request.user as { id: string };
    
    return prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        schedule: {
          include: {
            route: true,
            bus: true,
          },
        },
      },
    });
  });

  // Cancel booking
  fastify.patch('/:id/cancel', {
    onRequest: [fastify.authenticate],
  }, async (request, reply) => {
    const user = request.user as { id: string; role: string };
    const { id } = request.params as { id: string };

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return reply.status(404).send({ error: 'Booking not found' });
    }

    if (booking.userId !== user.id && user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    return prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });
  });
}