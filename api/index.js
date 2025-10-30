const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('../config/database');
const { typeDefs, resolvers } = require('../graphql/schema');
const authMiddleware = require('../middleware/auth');
const logger = require('../utils/logger');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Cache Apollo Server instance
let apolloServer = null;

async function getApolloServer() {
  if (apolloServer) {
    return apolloServer;
  }

  // Connect to MongoDB (cached by Mongoose)
  await connectDB();

  // Initialize Apollo Server
  apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      logger.error('GraphQL Error:', error);
      return error;
    },
  });

  await apolloServer.start();
  return apolloServer;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GraphQL endpoint
app.use('/graphql', async (req, res) => {
  try {
    const server = await getApolloServer();
    return expressMiddleware(server, {
      context: authMiddleware,
    })(req, res);
  } catch (error) {
    logger.error('Apollo Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export for Vercel
module.exports = app;