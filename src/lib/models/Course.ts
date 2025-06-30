import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
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
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'computer_science', 'history', 'literature', 'languages', 'geography']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    required: true
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  enrolledStudents: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: true
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    reviews: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      timestamp: { type: Date, default: Date.now }
    }]
  }
}, {
  timestamps: true
});

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents.length;
});

// Text index for search
courseSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text'
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);