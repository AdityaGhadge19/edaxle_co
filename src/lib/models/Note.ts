import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Text index for search
noteSchema.index({
  content: 'text',
  tags: 'text'
});

export default mongoose.models.Note || mongoose.model('Note', noteSchema);