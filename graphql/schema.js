// TypeDefs
const userTypeDefs = require('./typeDefs/user');
const postTypeDefs = require('./typeDefs/post');
const leadTypeDefs = require('./typeDefs/lead');

// Resolvers
const userResolvers = require('./resolvers/user');
const postResolvers = require('./resolvers/post');
const leadResolvers = require('./resolvers/lead');

// Combine all type definitions
const typeDefs = [userTypeDefs, postTypeDefs, leadTypeDefs];

// Combine all resolvers
const resolvers = [userResolvers, postResolvers, leadResolvers];

module.exports = { typeDefs, resolvers };