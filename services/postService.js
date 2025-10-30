const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('../utils/errors');
const logger = require('../utils/logger');

class PostService {
  async getAllPosts({ limit = 10, offset = 0 }) {
    try {
      logger.info(`Fetching posts - limit: ${limit}, offset: ${offset}`);
      
      const [posts, total] = await Promise.all([
        Post.find().sort({ createdAt: -1 }).limit(limit).skip(offset),
        Post.countDocuments()
      ]);

      return {
        posts: posts.map(post => ({
          id: post._id.toString(),
          title: post.title,
          content: post.content,
          authorId: post.authorId.toString(),
          published: post.published,
          tags: post.tags,
          views: post.views,
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString()
        })),
        total,
        hasMore: offset + limit < total
      };
    } catch (error) {
      logger.error('Error fetching posts:', error);
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  }

  async getPostById(id) {
    try {
      logger.info(`Fetching post with id: ${id}`);
      const post = await Post.findById(id);
      
      if (!post) {
        throw new Error('Post not found');
      }

      return {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        authorId: post.authorId.toString(),
        published: post.published,
        tags: post.tags,
        views: post.views,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        author: async () => {
          const user = await User.findById(post.authorId);
          return user ? {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            age: user.age,
            isActive: user.isActive,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
          } : null;
        }
      };
    } catch (error) {
      logger.error('Error fetching post:', error);
      throw new Error(`Failed to fetch post: ${error.message}`);
    }
  }

  async postsByUser ({ userId }) {
    try {
      logger.info(`Fetching posts by user: ${userId}`);
      const posts = await Post.findByAuthor(userId);
      
      return posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        authorId: post.authorId.toString(),
        published: post.published,
        tags: post.tags,
        views: post.views,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }));
    } catch (error) {
      logger.error('Error fetching posts by user:', error);
      throw new Error(`Failed to fetch user posts: ${error.message}`);
    }
  }

  async createPost(input) {
    try {
      logger.info(`Creating post by author: ${input.authorId}`);
      
      // Verify author exists
      const author = await User.findById(input.authorId);
      if (!author) {
        throw new Error('Author not found');
      }

      const post = new Post(input);
      await post.save();

      logger.info(`Post created successfully: ${post._id}`);

      return {
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        authorId: post.authorId.toString(),
        published: post.published,
        tags: post.tags,
        views: post.views,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      };
    } catch (error) {
      logger.error('Error creating post:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async publishedPosts () {
    try {
      const posts = await Post.findPublished();
      
      return posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        authorId: post.authorId.toString(),
        published: post.published,
        tags: post.tags,
        views: post.views,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }));
    } catch (error) {
      logger.error('Error fetching published posts:', error);
      throw new Error(`Failed to fetch published posts: ${error.message}`);
    }
  }

  async publishPost () {
    try {
      const posts = await Post.findPublished();
      
      return posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        authorId: post.authorId.toString(),
        published: post.published,
        tags: post.tags,
        views: post.views,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }));
    } catch (error) {
      logger.error('Error fetching published posts:', error);
      throw new Error(`Failed to fetch published posts: ${error.message}`);
    }
  }

  async searchPosts (searchTerm) {
    try {
      logger.info(`Searching posts with term: ${searchTerm}`);
      
      const posts = await Post.find({
        $text: { $search: searchTerm }
      }).limit(20);

      return posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        authorId: post.authorId.toString(),
        published: post.published,
        tags: post.tags,
        views: post.views,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }));
    } catch (error) {
      logger.error('Error searching posts:', error);
      throw new Error(`Failed to search posts: ${error.message}`);
    }
  }

  async updatePost(id, input) {
    try {
      logger.info(`Updating post: ${id}`);

      const post = await Post.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      );

      if (!post) {
        throw new Error('Post not found');
      }

      logger.info(`Post updated successfully: ${post._id}`);

      return {
        id: post._id.toString(),
        title: post.title,
        content: post.content
      }
    } catch (error) {
      logger.error('Error creating post:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }

  async deletePost(id) {
    try {
      const user = await Post.findByIdAndDelete(id);
      if (!user) {
        throw new UserInputError('User not found');
      }
      return true;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = new PostService();