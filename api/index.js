const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('../config/database');
const { typeDefs, resolvers } = require('../graphql/schema');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false 
}));
app.use(cors());
app.use(express.json());

// Cache Apollo Server instance
let apolloServer = null;
let isServerInitialized = false;

async function initializeApolloServer() {
  if (isServerInitialized && apolloServer) {
    return apolloServer;
  }

  try {
    // Connect to MongoDB (cached by Mongoose)
    await connectDB();

    // Initialize Apollo Server
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          embed: true,
          includeCookies: true,
        }),
      ],
      formatError: (error) => {
        logger.error('GraphQL Error:', error);
        return error;
      },
    });

    await apolloServer.start();
    isServerInitialized = true;
    
    logger.info('Apollo Server initialized successfully');
    return apolloServer;
  } catch (error) {
    logger.error('Failed to initialize Apollo Server:', error);
    isServerInitialized = false;
    apolloServer = null;
    throw error;
  }
}

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

// Apply GraphQL middleware
app.use('/graphql', async (req, res, next) => {
  try {
    const server = await initializeApolloServer();
    const middleware = expressMiddleware(server, {
      context: authMiddleware,
    });
    return middleware(req, res, next);
  } catch (error) {
    logger.error('GraphQL middleware error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize GraphQL server',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Export for Vercel
module.exports = app;