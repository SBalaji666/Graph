const { off } = require('../../models/Post');
const postService = require('../../services/postService');
const { AuthenticationError, UserInputError } = require('../../utils/errors');

const postResolvers = {
  Query: {
    posts: async (_, { limit, offset }, { user }) => {
      return await postService.getAllPosts({limit, offset});
    },
    
    post: async (_, { id }, { user }) => {
      return await postService.getPostById(id);
    },

    postsByUser: async (_, { id }, { user }) => {
      return await postService.postsByUser({userId : id});
    },

    publishedPosts: async () => {
      return await postService.publishPost();
    },

    searchPosts: async (_, { searchTerm }, { user }) => {
      return await postService.searchPosts(searchTerm);
    },
  },

  Mutation: {    
    createPost: async (_, { input }, { user }) => {
      return await postService.createPost(input);
    },

    updatePost: async (_, { id, input }, { user }) => {
      return await postService.updatePost(id, input);
    },
    
    deletePost: async (_, { id }, { user }) => {
      return await postService.deletePost(id);
    },

    publishPost: async (_, { id }, { user }) => {
      return await postService.publishedPosts(id);
    }
  }
};

module.exports = postResolvers;