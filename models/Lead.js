// src/models/Post.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  firstName: {
    type: String,
    required: [true, 'firstName is required'],
    minlength: [3, 'firstName must be at least 10 characters'],
    maxlength: [20, 'firstName cannot exceed 5000 characters']
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  company: [{
    type: mongoose.Schema.Types.ObjectId,
    trim: true
  }],
  phone: {
    type: String,
  },
  status: {
    type: String,
  },
  description: {
    type: String,
  },
  segment: [{
    type: String,
    trim: true
  }],
  assigned: [{
    type: mongoose.Schema.Types.ObjectId,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
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

// Indexes for better performance
leadSchema.index({ title: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;