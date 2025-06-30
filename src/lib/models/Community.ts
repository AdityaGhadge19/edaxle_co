import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['mathematics', 'physics', 'chemistry', 'biology', 'computer_science', 'history', 'literature', 'languages', 'geography']
  },
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['member', 'moderator', 'admin'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  channels: [{
    name: String,
    type: { type: String, enum: ['text', 'voice', 'announcement'] },
    description: String
  }],
  rules: [String],
  tags: [String],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for member count
communitySchema.virtual('memberCount').get(function() {
  return this.members.length;
});

export default mongoose.models.Community || mongoose.model('Community', communitySchema);