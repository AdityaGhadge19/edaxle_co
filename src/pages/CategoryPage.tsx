import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';
import VideoCard from '../components/video/VideoCard';
import { Search, Filter, BookOpen, Video, GraduationCap } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { getVideosByCategory, categories } = useVideos();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  const category = categories.find(c => c.id === categoryId);
  const videos = getVideosByCategory(categoryId || '');

  // Mock data for different content types
  const mockExams = [
    { id: '1', name: 'SAT Math', description: 'Comprehensive SAT Mathematics preparation', videoCount: 45 },
    { id: '2', name: 'AP Calculus', description: 'Advanced Placement Calculus AB & BC', videoCount: 67 },
    { id: '3', name: 'GRE Quantitative', description: 'GRE Quantitative Reasoning section prep', videoCount: 32 }
  ];

  const mockTopics = [
    { id: '1', name: 'Algebra Fundamentals', description: 'Basic algebraic concepts and operations', videoCount: 28 },
    { id: '2', name: 'Calculus Derivatives', description: 'Understanding derivatives and applications', videoCount: 34 },
    { id: '3', name: 'Statistics & Probability', description: 'Statistical analysis and probability theory', videoCount: 22 }
  ];

  const mockCourses = [
    {
      id: '1',
      title: 'Complete Mathematics Mastery',
      instructor: 'Math Masters',
      thumbnailUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      price: 49.99,
      rating: 4.8,
      students: 1247,
      duration: '12 hours'
    },
    {
      id: '2',
      title: 'Linear Algebra Fundamentals',
      instructor: 'Math Academy',
      thumbnailUrl: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      price: 0,
      rating: 4.6,
      students: 892,
      duration: '8 hours'
    }
  ];

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!category) {
    return <div className="min-h-screen flex items-center justify-center">Category not found</div>;
  }

  return (
    <div>
      <div className="relative rounded-lg overflow-hidden mb-6 h-40 md:h-60">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {category.name}
          </h1>
          <p className="text-white/80 max-w-2xl">{category.description}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card-bg rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border-color rounded-md bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'all'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          All Content
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'videos'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          Videos ({filteredVideos.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'courses'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          Courses ({mockCourses.length})
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'exams'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          Exam Prep
        </button>
        <button
          onClick={() => setActiveTab('topics')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
            activeTab === 'topics'
              ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-primary'
          }`}
        >
          Topics
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'all' && (
        <div className="space-y-8">
          {/* Featured Courses */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <GraduationCap className="mr-2" size={24} />
              Featured Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCourses.map((course) => (
                <div key={course.id} className="bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{course.instructor}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-primary">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        ⭐ {course.rating} • {course.students} students
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Videos */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Video className="mr-2" size={24} />
              Popular Videos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos.slice(0, 8).map((video) => (
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
                  tags={video.tags}
                />
              ))}
            </div>
          </div>

          {/* Exam Preparation */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BookOpen className="mr-2" size={24} />
              Exam Preparation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockExams.map((exam) => (
                <div key={exam.id} className="bg-card-bg rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <h3 className="font-bold text-lg mb-2">{exam.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{exam.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{exam.videoCount} videos</span>
                    <button className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                      Start Prep
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">All Videos</h2>
          </div>
          
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
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
                  tags={video.tags}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">No videos found in this category.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'courses' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Available Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <div key={course.id} className="bg-card-bg rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{course.instructor}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-primary">
                      {course.price === 0 ? 'Free' : `$${course.price}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      ⭐ {course.rating}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {course.students} students • {course.duration}
                  </div>
                  <button className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                    {course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Exam Preparation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockExams.map((exam) => (
              <div key={exam.id} className="bg-card-bg rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <h3 className="font-bold text-lg mb-2">{exam.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{exam.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{exam.videoCount} videos</span>
                  <button className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                    Start Preparation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Study Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTopics.map((topic) => (
              <div key={topic.id} className="bg-card-bg rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <h3 className="font-bold text-lg mb-2">{topic.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{topic.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{topic.videoCount} videos</span>
                  <button className="py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition">
                    Explore Topic
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;