const postTypeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    published: Boolean!
    tags: [String!]!
    views: Int!
    createdAt: String!
    updatedAt: String!
    author: User
  }

  type PostList {
    posts: [Post]
    total: Int
    hasMore: Boolean
  }

  type Query {
    posts(limit: Int, offset: Int): PostList
    post(id: ID!): Post
    postsByUser(id: ID!): [Post]
    publishedPosts: [Post]
    searchPosts(searchTerm: String!): [Post]
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
    published: Boolean!
  }
  

  input UpdatePostInput {
    title: String!
    content: String!
    authorId: ID!
    published: Boolean!
  }
 

  type Mutation {
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    publishPost(id: ID!): Post
  }
`;

module.exports = postTypeDefs;