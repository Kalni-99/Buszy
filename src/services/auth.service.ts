import { FastifyInstance } from 'fastify';

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async generateToken(user: any) {
    return this.fastify.jwt.sign({ 
      id: user._id, 
      role: user.role 
    });
  }
}