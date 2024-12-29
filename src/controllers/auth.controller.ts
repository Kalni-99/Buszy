import { FastifyReply, FastifyRequest } from 'fastify';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  constructor(private authService: AuthService) {}

  async register(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, name, phone } = request.body as any;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.status(400).send({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      name,
      phone
    });

    const token = await this.authService.generateToken(user);
    
    return { user: user.toJSON(), token };
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;
    
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = await this.authService.generateToken(user);
    
    return { user: user.toJSON(), token };
  }
}