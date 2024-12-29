import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify);
  const authController = new AuthController(authService);

  fastify.post('/register', (req, reply) => authController.register(req, reply));
  fastify.post('/login', (req, reply) => authController.login(req, reply));
}