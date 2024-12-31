import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import mongoose from 'mongoose';

import { authRoutes } from './routes/auth.routes.js';
import { bookingRoutes } from './routes/booking.routes.js';
import { routeRoutes } from './routes/route.routes.js';
import { busRoutes } from './routes/bus.routes.js';
import { scheduleRoutes } from './routes/schedule.routes.js';

import { authenticate } from './middleware/auth.js';

// Register the authenticate function

const fastify = Fastify({
  logger: true,
});
fastify.decorate('authenticate', authenticate);

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://yasasrana77:5gzQoHw8rUXWwv5J@cluster0.fvgdj.mongodb.net/ntc_db');
console.log('Connected to MongoDB');

// Register plugins
await fastify.register(cors, {
  origin: true,
});

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret',
});

// Swagger documentation
await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'Buszy Bus Reservation API',
      description: 'Web API for National Transport Commission of Sri Lanka Bus Reservation System',
      version: '1.0.0',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

await fastify.register(swaggerUi, {
  routePrefix: '/documentation',
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(bookingRoutes, { prefix: '/api/bookings' });
fastify.register(routeRoutes, { prefix: '/api/routes' });
fastify.register(busRoutes, { prefix: '/api/buses' });
fastify.register(scheduleRoutes, { prefix: '/api/schedules' });

// Start server
try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
  console.log('Server is running on http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}