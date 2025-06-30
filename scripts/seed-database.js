import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/lib/models/User.js';
import Video from '../src/lib/models/Video.js';
import Course from '../src/lib/models/Course.js';
import Community from '../src/lib/models/Community.js';
import Note from '../src/lib/models/Note.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/learnone');
    console.log('📦 Connected to MongoDB for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Video.deleteMany({}),
      Course.deleteMany({}),
      Community.deleteMany({}),
      Note.deleteMany({})
    ]);

    // Create users
    const hashedPassword = await bcrypt.hash('password', 10);
    
    const users = await User.create([
      {
        name: 'Math Masters',
        email: 'teacher@learnone.com',
        password: hashedPassword,
        role: 'teacher',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'Passionate mathematics educator with over 10 years of experience.',
        subjects: ['Mathematics', 'Calculus', 'Algebra'],
        isVerified: true
      },
      {
        name: 'Student Demo',
        email: 'student@learnone.com',
        password: hashedPassword,
        role: 'student',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        bio: 'Enthusiastic learner passionate about mathematics and science.'
      },
      {
        name: 'Physics Academy',
        email: 'physics@learnone.com',
        password: hashedPassword,
        role: 'teacher',
        avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
        bio: 'Physics professor specializing in quantum mechanics.',
        subjects: ['Physics', 'Quantum Mechanics'],
        isVerified: true
      }
    ]);

    console.log('✅ Users created');

    // Create videos
    const videos = await Video.create([
      {
        title: 'Introduction to Calculus',
        description: 'Learn the fundamental concepts of calculus including limits, derivatives, and integrals.',
        thumbnailUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 480,
        views: 2000,
        author: users[0]._id,
        category: 'mathematics',
        tags: ['calculus', 'mathematics', 'derivatives', 'integrals'],
        likes: [users[1]._id]
      },
      {
        title: 'Physics: Laws of Motion',
        description: 'Understanding Newton\'s laws of motion and their applications.',
        thumbnailUrl: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        duration: 240,
        views: 5000000,
        author: users[2]._id,
        category: 'physics',
        tags: ['physics', 'mechanics', 'newton laws'],
        likes: [users[1]._id]
      }
    ]);

    console.log('✅ Videos created');

    // Create courses
    const courses = await Course.create([
      {
        title: 'Complete Calculus Mastery',
        description: 'Master calculus from basics to advanced topics with comprehensive lessons.',
        thumbnailUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        instructor: users[0]._id,
        category: 'mathematics',
        level: 'intermediate',
        price: 49.99,
        duration: '12 hours',
        videos: [videos[0]._id],
        tags: ['calculus', 'mathematics', 'comprehensive'],
        enrolledStudents: [{ student: users[1]._id, progress: 65 }]
      }
    ]);

    console.log('✅ Courses created');

    // Create communities
    const communities = await Community.create([
      {
        name: 'Advanced Mathematics Hub',
        description: 'A community for advanced mathematics students and enthusiasts.',
        imageUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        creator: users[0]._id,
        category: 'mathematics',
        members: [
          { user: users[0]._id, role: 'admin' },
          { user: users[1]._id, role: 'member' }
        ],
        channels: [
          { name: 'general', type: 'text', description: 'General discussion' },
          { name: 'announcements', type: 'announcement', description: 'Important updates' }
        ],
        rules: ['Be respectful', 'Stay on topic', 'No spam'],
        tags: ['calculus', 'algebra', 'geometry'],
        isVerified: true
      }
    ]);

    console.log('✅ Communities created');

    // Create notes
    await Note.create([
      {
        user: users[1]._id,
        video: videos[0]._id,
        content: 'The power rule for derivatives: If f(x) = x^n, then f\'(x) = n * x^(n-1)',
        timestamp: 522,
        tags: ['calculus', 'derivatives', 'power rule']
      },
      {
        user: users[1]._id,
        video: videos[1]._id,
        content: 'Newton\'s first law: An object at rest stays at rest unless acted upon by an external force.',
        timestamp: 120,
        tags: ['physics', 'newton', 'first law']
      }
    ]);

    console.log('✅ Notes created');

    // Update follower relationships
    await User.findByIdAndUpdate(users[0]._id, {
      $push: { followers: users[1]._id }
    });
    
    await User.findByIdAndUpdate(users[1]._id, {
      $push: { following: users[0]._id }
    });

    console.log('✅ User relationships updated');
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDatabase();