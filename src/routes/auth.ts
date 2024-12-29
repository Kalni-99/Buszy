import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = loginSchema.extend({
  name: z.string(),
  phone: z.string().optional(),
});

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);
    
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return reply.status(400).send({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    
    return { user, token };
  });

  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);
    
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || !await bcrypt.compare(body.password, user.password)) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  });
}