import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'computer_science', 'history', 'literature', 'languages', 'geography']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  lessonNumber: {
    type: Number,
    default: null
  },
  notes: [{
    title: String,
    content: String,
    fileUrl: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      timestamp: { type: Date, default: Date.now }
    }]
  }]
}, {
  timestamps: true
});

// Virtual for like count
videoSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for dislike count
videoSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// Text index for search
videoSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

export default mongoose.models.Video || mongoose.model('Video', videoSchema);