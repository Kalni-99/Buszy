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
  openapi: {
    info: {
      title: 'Buszy Bus Reservation API',
      description: 'Web API for National Transport Commission of Sri Lanka Bus Reservation System',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://api.buszy.me',
        description: 'Production server',
      },
      {
        url: 'http://54.243.114.235',
        description: 'Production server (IP Address)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your bearer token in the format **Bearer <token>**'
        }
      }
    },
    security: [
      {
        Bearer: []
      }
    ]
  }
});

await fastify.register(swaggerUi, {
  routePrefix: '/documentation'
});

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(bookingRoutes, { prefix: '/api/bookings' });
fastify.register(routeRoutes, { prefix: '/api/routes' });
fastify.register(busRoutes, { prefix: '/api/buses' });
fastify.register(scheduleRoutes, { prefix: '/api/schedules' });
fastify.get('/', async (request, reply) => {
  reply.type('text/html').send(`
    <html>
      <head><title>Buszy API</title></head>
      <body align="center">
        <h1>Welcome to Buszy Bus Reservation API</h1>
        <p>Visit <a href="/documentation">API Documentation</a></p>
        <p>Author: Kalani</p>
      </body>
    </html>
  `);
});


// Start server
try {
  await fastify.listen({ port: 80, host: '0.0.0.0' });
  console.log('Server is running on http://localhost:3000');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
