const { GraphQLError } = require('graphql');

class AuthenticationError extends GraphQLError {
  constructor(message) {
    super(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
}

class UserInputError extends GraphQLError {
  constructor(message) {
    super(message, {
      extensions: {
        code: 'BAD_USER_INPUT',
      },
    });
  }
}

class ForbiddenError extends GraphQLError {
  constructor(message) {
    super(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
}

module.exports = { 
  AuthenticationError, 
  UserInputError, 
  ForbiddenError 
};