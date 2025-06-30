import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Video, Eye, Calendar, Bell, BellOff, Share2, BookOpen, GraduationCap } from 'lucide-react';
import { useVideos } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import VideoCard from '../components/video/VideoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { formatViewCount } from '../utils/formatUtils';

type TeacherProfile = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  totalViews: number;
  joinedDate: string;
  subjects: string[];
  isVerified: boolean;
};

type Course = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  duration: string;
  level: string;
  enrolledStudents: number;
  rating: number;
  lessonsCount: number;
};

const TeacherProfilePage = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const { videos } = useVideos();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // Mock teacher profile data - in a real app, this would come from an API
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);

  // Mock courses data
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Complete Calculus Mastery',
      description: 'Master calculus from basics to advanced topics with comprehensive lessons and practice problems.',
      thumbnailUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      price: 49.99,
      duration: '12 hours',
      level: 'Intermediate',
      enrolledStudents: 1247,
      rating: 4.8,
      lessonsCount: 24
    },
    {
      id: '2',
      title: 'Linear Algebra Fundamentals',
      description: 'Build a strong foundation in linear algebra with practical applications and real-world examples.',
      thumbnailUrl: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      price: 0,
      duration: '8 hours',
      level: 'Beginner',
      enrolledStudents: 892,
      rating: 4.6,
      lessonsCount: 16
    },
    {
      id: '3',
      title: 'Advanced Statistics & Probability',
      description: 'Deep dive into statistical analysis and probability theory for data science applications.',
      thumbnailUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      price: 79.99,
      duration: '15 hours',
      level: 'Advanced',
      enrolledStudents: 634,
      rating: 4.9,
      lessonsCount: 30
    }
  ]);

  useEffect(() => {
    // Mock teacher data based on teacherId
    const mockTeachers: Record<string, TeacherProfile> = {
      'math-masters': {
        id: '1',
        name: 'Math Masters',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        bio: 'Passionate mathematics educator with over 10 years of experience teaching calculus, algebra, and advanced mathematics. I believe in making complex concepts simple and accessible to all students.',
        followers: 15420,
        totalViews: 2500000,
        joinedDate: '2020-03-15',
        subjects: ['Mathematics', 'Calculus', 'Algebra', 'Statistics'],
        isVerified: true,
      },
      'history-hub': {
        id: '2',
        name: 'History Hub',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        bio: 'History enthusiast and educator specializing in world history, ancient civilizations, and historical analysis. Making the past come alive for modern learners.',
        followers: 8750,
        totalViews: 1200000,
        joinedDate: '2019-08-22',
        subjects: ['History', 'Ancient Civilizations', 'World Wars', 'Political Science'],
        isVerified: true,
      },
      'chemistry-lab': {
        id: '3',
        name: 'Chemistry Lab',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        bio: 'Chemistry professor and researcher with a passion for experimental science. I love showing students the fascinating world of chemical reactions and molecular structures.',
        followers: 12300,
        totalViews: 1800000,
        joinedDate: '2021-01-10',
        subjects: ['Chemistry', 'Organic Chemistry', 'Laboratory Techniques', 'Biochemistry'],
        isVerified: true,
      },
    };

    const foundTeacher = mockTeachers[teacherId || ''];
    if (foundTeacher) {
      setTeacher(foundTeacher);
      setFollowerCount(foundTeacher.followers);
      // Mock following status - in real app, check if current user follows this teacher
      setIsFollowing(Math.random() > 0.5);
    }
  }, [teacherId]);

  // Filter videos by this teacher
  const teacherVideos = videos.filter(video => 
    video.author.name.toLowerCase().replace(/\s+/g, '-') === teacherId
  );

  // Sort videos by different criteria
  const sortedVideos = {
    latest: [...teacherVideos].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    popular: [...teacherVideos].sort((a, b) => b.views - a.views),
    oldest: [...teacherVideos].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowerCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${teacher?.name} - LearnOne`,
        text: `Check out ${teacher?.name}'s educational content on LearnOne`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Teacher not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The teacher profile you're looking for doesn't exist.</p>
          <Link to="/" className="mt-4 inline-block py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Teacher Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <img
            src={teacher.avatar}
            alt={teacher.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold">{teacher.name}</h1>
              {teacher.isVerified && (
                <div className="bg-white text-primary rounded-full p-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <p className="text-white/90 mb-4 max-w-2xl">{teacher.bio}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users size={16} />
                <span>{formatViewCount(followerCount)} followers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Video size={16} />
                <span>{teacherVideos.length} videos</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen size={16} />
                <span>{courses.length} courses</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye size={16} />
                <span>{formatViewCount(teacher.totalViews)} total views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>Joined {new Date(teacher.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            {user && user.id !== teacher.id && (
              <button
                onClick={handleFollow}
                className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition ${
                  isFollowing
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-white text-primary hover:bg-gray-100'
                }`}
              >
                {isFollowing ? <BellOff size={16} /> : <Bell size={16} />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            )}
            
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-6 py-2 rounded-full font-medium bg-white/20 text-white hover:bg-white/30 transition"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
        
        {/* Subjects */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Subjects:</h3>
          <div className="flex flex-wrap gap-2">
            {teacher.subjects.map((subject, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 rounded-full text-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="videos">Videos ({teacherVideos.length})</TabsTrigger>
          <TabsTrigger value="courses">Courses ({courses.length})</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">All Videos</h2>
            
            <select 
              className="px-3 py-1 border border-border-color rounded-md bg-card-bg text-text-primary"
              onChange={(e) => {
                const sortType = e.target.value as keyof typeof sortedVideos;
                // In a real app, you'd update the displayed videos based on sort
              }}
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
          
          {teacherVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedVideos.latest.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  thumbnailUrl={video.thumbnailUrl}
                  authorName={video.author.name}
                  authorAvatar={video.author.avatar}
                  views={video.views}
                  createdAt={video.createdAt}
                  duration={video.duration}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Video size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No videos uploaded yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="courses">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">All Courses</h2>
            
            <select className="px-3 py-1 border border-border-color rounded-md bg-card-bg text-text-primary">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="relative">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {course.lessonsCount} lessons
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {course.duration}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.level === 'Beginner' ? 'bg-green-100 text-green-600' :
                        course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {course.level}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <GraduationCap size={14} />
                        <span>{formatViewCount(course.enrolledStudents)} students</span>
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </div>
                    </div>
                    
                    <button className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                      {course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No courses available yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">About {teacher.name}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{teacher.bio}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Teaching Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">{formatViewCount(followerCount)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">{teacherVideos.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Videos</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">{courses.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Courses</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-bold text-primary">{formatViewCount(teacher.totalViews)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Contact</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  For business inquiries or collaboration opportunities, please reach out through the platform's messaging system.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherProfilePage;