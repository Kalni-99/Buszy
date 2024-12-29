import { FastifyReply, FastifyRequest } from 'fastify';
import { Booking, BookingStatus } from '../models/Booking.js';
import { Schedule } from '../models/Schedule.js';

export class BookingController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { scheduleId, seatNumber } = request.body as any;
    const userId = (request.user as any).id;

    const existingBooking = await Booking.findOne({
      schedule: scheduleId,
      seatNumber,
      status: BookingStatus.CONFIRMED
    });

    if (existingBooking) {
      return reply.status(400).send({ error: 'Seat already booked' });
    }

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      return reply.status(404).send({ error: 'Schedule not found' });
    }

    const booking = await Booking.create({
      user: userId,
      schedule: scheduleId,
      seatNumber,
      status: BookingStatus.CONFIRMED
    });

    return booking.populate(['schedule', 'user']);
  }

  async getUserBookings(request: FastifyRequest) {
    const userId = (request.user as any).id;
    
    return Booking.find({ user: userId })
      .populate({
        path: 'schedule',
        populate: ['route', 'bus']
      });
  }

  async cancelBooking(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    const user = request.user as any;

    const booking = await Booking.findById(id);
    if (!booking) {
      return reply.status(404).send({ error: 'Booking not found' });
    }

    if (booking.user.toString() !== user.id && user.role !== 'ADMIN') {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    booking.status = BookingStatus.CANCELLED;
    await booking.save();

    return booking;
  }
}