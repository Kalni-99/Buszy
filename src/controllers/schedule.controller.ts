import { FastifyRequest, FastifyReply } from 'fastify';
import { Schedule } from '../models/Schedule.js';

export class ScheduleController {
  async getAllSchedules(request: FastifyRequest) {
    return Schedule.find()
      .populate(['route', 'bus']);
  }

  async getScheduleById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    
    const schedule = await Schedule.findById(id)
      .populate(['route', 'bus']);

    if (!schedule) {
      return reply.status(404).send({ error: 'Schedule not found' });
    }

    return schedule;
  }

  async createSchedule(request: FastifyRequest, reply: FastifyReply) {
    // const user = request.user as any;
    // if (user.role !== 'ADMIN' && user.role !== 'OPERATOR') {
    //   return reply.status(403).send({ error: 'Unauthorized' });
    // }

    const schedule = await Schedule.create(request.body);
    return schedule.populate(['route', 'bus']);
  }

  async updateSchedule(request: FastifyRequest, reply: FastifyReply) {
 
    const { id } = request.params as any;
    const schedule = await Schedule.findByIdAndUpdate(id, request.body as any, { 
      new: true 
    }).populate(['route', 'bus']);

    if (!schedule) {
      return reply.status(404).send({ error: 'Schedule not found' });
    }

    return schedule;
  }
}