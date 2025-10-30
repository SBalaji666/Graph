const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('../utils/errors');
const logger = require('../utils/logger');

class UserService {
  async getAllUsers() {
    try {
      return await User.find({ isActive: true });
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new UserInputError('User not found');
      }
      return user;
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(input) {
    try {
      const existingUser = await User.findOne({ email: input.email });
      if (existingUser) {
        throw new UserInputError('Email already exists');
      }

      const user = await User.create(input);
      const token = this.generateToken(user);

      return { token, user };
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new AuthenticationError('Invalid credentials');
      }

      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated');
      }

      const token = this.generateToken(user);
      return { token, user };
    } catch (error) {
      logger.error('Error logging in:', error);
      throw error;
    }
  }

  async updateUser(id, input) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new UserInputError('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new UserInputError('User not found');
      }
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }
}

module.exports = new UserService();