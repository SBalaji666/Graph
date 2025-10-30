// src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  published: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for author details
postSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Indexes for better performance
postSchema.index({ authorId: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ title: 'text', content: 'text' }); // Text search

// Pre-save middleware
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to increment views
postSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Static method to find posts by author
postSchema.statics.findByAuthor = function(authorId) {
  return this.find({ authorId }).sort({ createdAt: -1 });
};

// Static method to find published posts
postSchema.statics.findPublished = function() {
  return this.find({ published: true }).sort({ createdAt: -1 });
};

postSchema.statics.findUnpublished = function() {
  return this.find({ published: false }).sort({ createdAt: -1 });
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;