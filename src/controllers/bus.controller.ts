import { FastifyRequest, FastifyReply } from 'fastify';
import { Bus, BusType } from '../models/Bus.js';

export class BusController {
  async getAllBuses(request: FastifyRequest) {
    return Bus.find();
  }

  async getBusById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as any;
    
    const bus = await Bus.findById(id);
    if (!bus) {
      return reply.status(404).send({ error: 'Bus not found' });
    }

    return bus;
  }

  async createBus(request: FastifyRequest, reply: FastifyReply) {
    // const user = request.user as any;
    // if (user.role !== 'ADMIN' && user.role !== 'OPERATOR') {
    //   return reply.status(403).send({ error: 'Unauthorized' });
    // }

    const bus = await Bus.create(request.body);
    return bus;
  }

  async updateBus(request: FastifyRequest, reply: FastifyReply) {
    const user = request.user as any;
    // if (user.role !== 'ADMIN' && user.role !== 'OPERATOR') {
    //   return reply.status(403).send({ error: 'Unauthorized' });
    // }

    const { id } = request.params as any;
    const bus = await Bus.findByIdAndUpdate(id, request.body as Partial<{ createdAt: Date; updatedAt: Date; type: BusType; plateNumber: string; capacity: number; operator: string; }>, { new: true });

    if (!bus) {
      return reply.status(404).send({ error: 'Bus not found' });
    }

    return bus;
  }
}