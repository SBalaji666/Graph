const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;
let connectionPromise = null;

const connectDB = async () => {
  // Return existing connection if already connected
  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }

  // If connection is in progress, wait for it
  if (connectionPromise) {
    logger.info('⏳ Waiting for ongoing MongoDB connection...');
    return connectionPromise;
  }

  // Check if MONGODB_URI is set
  if (!process.env.MONGODB_URI) {
    const error = new Error('❌ MONGODB_URI environment variable is not set');
    logger.error(error.message);
    throw error;
  }

  try {
    logger.info('🔄 Connecting to MongoDB...');

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    };

    // Store the connection promise to prevent duplicate connections
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, options);
    const conn = await connectionPromise;

    isConnected = true;
    connectionPromise = null;

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected');
      isConnected = true;
    });

    return conn;
  } catch (error) {
    isConnected = false;
    connectionPromise = null;
    
    logger.error('❌ MongoDB connection failed:', error.message);
    
    // Don't use process.exit() in serverless - throw error instead
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

// Only add SIGINT handler in non-serverless environments
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  process.on('SIGINT', async () => {
    try {
      if (isConnected) {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
      }
      process.exit(0);
    } catch (err) {
      logger.error('Error during MongoDB disconnection:', err);
      process.exit(1);
    }
  });
}

module.exports = connectDB;