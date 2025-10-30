const userService = require('../../services/userService');
const { AuthenticationError, UserInputError } = require('../../utils/errors');

const userResolvers = {
  Query: {
    users: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await userService.getAllUsers();
    },
    
    user: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await userService.getUserById(id);
    },
    
    me: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await userService.getUserById(user.id);
    }
  },

  Mutation: {
    register: async (_, { input }) => {
      return await userService.createUser(input);
    },
    
    login: async (_, { email, password }) => {
      return await userService.loginUser(email, password);
    },
    
    updateUser: async (_, { id, input }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      if (user.id !== id && user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }
      return await userService.updateUser(id, input);
    },
    
    deleteUser: async (_, { id }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      if (user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }
      return await userService.deleteUser(id);
    }
  }
};

module.exports = userResolvers;