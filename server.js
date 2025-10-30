const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const { typeDefs, resolvers } = require('./graphql/schema');
const authMiddleware = require('./middleware/auth');
const logger = require('./utils/logger');

async function startServer() {
  const app = express();
  
  // Connect to MongoDB
  await connectDB();

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      logger.error('GraphQL Error:', error);
      return error;
    },
  });

  await server.start();

  // Middleware
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({ 
      message: 'GraphQL API Server',
      endpoints: {
        health: '/health',
        graphql: '/graphql'
      }
    });
  });

  // GraphQL endpoint
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});