const userTypeDefs = require('./typeDefs/user');
const postTypeDefs = require('./typeDefs/post');
const userResolvers = require('./resolvers/user');
const postResolvers = require('./resolvers/post');

// Combine all type definitions
const typeDefs = [userTypeDefs, postTypeDefs];

// Combine all resolvers
const resolvers = [userResolvers, postResolvers];

module.exports = { typeDefs, resolvers };