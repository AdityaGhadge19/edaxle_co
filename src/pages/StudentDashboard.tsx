import { useState, useEffect } from 'react';
import { useVideos } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import StudentStats from '../components/dashboard/StudentStats';
import CourseProgress from '../components/dashboard/CourseProgress';
import VideoCard from '../components/video/VideoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Search, FileText, Clock, Tag } from 'lucide-react';
import { searchService } from '../lib/services/searchService';

const StudentDashboard = () => {
  const { videos } = useVideos();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);

  // Mock data for course progress
  const courses = [
    {
      id: '1',
      title: 'Introduction to Machine Learning',
      instructor: 'Tech Learning',
      thumbnailUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      progress: 65,
      totalLectures: 24,
      completedLectures: 16,
    },
    {
      id: '2',
      title: 'Basic Calculus for Beginners',
      instructor: 'Math Masters',
      thumbnailUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      progress: 30,
      totalLectures: 18,
      completedLectures: 5,
    },
    {
      id: '3',
      title: 'Advanced React Hooks Tutorial',
      instructor: 'JavaScript Guru',
      thumbnailUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      progress: 90,
      totalLectures: 12,
      completedLectures: 11,
    },
  ];

  // Mock notes data - in real app, fetch from database
  useEffect(() => {
    const mockNotes = [
      {
        id: '1',
        content: 'The difference between supervised and unsupervised learning: Supervised learning uses labeled data while unsupervised learning works with unlabeled data.',
        timestamp: 923, // 15:23
        video: {
          id: '1',
          title: 'Introduction to Machine Learning',
          thumbnailUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          author: 'Tech Learning'
        },
        tags: ['machine learning', 'supervised', 'unsupervised'],
        createdAt: '2025-01-12T10:30:00Z'
      },
      {
        id: '2',
        content: 'useEffect cleanup functions are important to prevent memory leaks. They run before the component unmounts or before the effect runs again.',
        timestamp: 1455, // 24:15
        video: {
          id: '2',
          title: 'Advanced React Hooks Tutorial',
          thumbnailUrl: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          author: 'JavaScript Guru'
        },
        tags: ['react', 'hooks', 'useEffect', 'cleanup'],
        createdAt: '2025-01-08T14:20:00Z'
      },
      {
        id: '3',
        content: 'The power rule for derivatives: If f(x) = x^n, then f\'(x) = n * x^(n-1). This is fundamental for calculus.',
        timestamp: 522, // 8:42
        video: {
          id: '3',
          title: 'Basic Calculus for Beginners',
          thumbnailUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          author: 'Math Masters'
        },
        tags: ['calculus', 'derivatives', 'power rule'],
        createdAt: '2025-01-01T09:15:00Z'
      },
      {
        id: '4',
        content: 'Neural networks are inspired by biological neurons. Each node processes input and passes output to the next layer.',
        timestamp: 1200, // 20:00
        video: {
          id: '1',
          title: 'Introduction to Machine Learning',
          thumbnailUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          author: 'Tech Learning'
        },
        tags: ['neural networks', 'machine learning', 'AI'],
        createdAt: '2025-01-10T16:45:00Z'
      }
    ];
    setNotes(mockNotes);
    setFilteredNotes(mockNotes);
  }, []);

  // Search notes functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mock saved videos
  const savedVideos = videos.slice(0, 4);
  
  // Mock history
  const watchHistory = videos.slice(4, 8);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Student Dashboard</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="notes">My Notes ({notes.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <StudentStats />
          
          <CourseProgress courses={courses} />
          
          <div className="bg-card-bg rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recommended For You</h2>
              <button className="text-primary hover:underline">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.slice(8, 12).map((video) => (
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
        </TabsContent>
        
        <TabsContent value="courses">
          <div className="bg-card-bg rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">My Courses</h2>
            
            <CourseProgress courses={courses} />
          </div>
          
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Completed Courses</h2>
            
            <div className="flex items-center space-x-4 p-4 bg-background rounded-lg">
              <img
                src="https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Course"
                className="w-20 h-20 object-cover rounded-md"
              />
              
              <div className="flex-1">
                <h3 className="font-medium">Photography Basics: Understanding Composition</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instructor: Photography World
                </p>
                <div className="flex items-center mt-2">
                  <div className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs text-green-600 dark:text-green-400 font-medium">
                    Completed
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    Certificate issued on May 15, 2025
                  </span>
                </div>
              </div>
              
              <button className="px-3 py-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition">
                View Certificate
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Saved Videos</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedVideos.map((video) => (
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
        </TabsContent>
        
        <TabsContent value="history">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Watch History</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchHistory.map((video) => (
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
        </TabsContent>
        
        <TabsContent value="notes">
          <div className="bg-card-bg rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <FileText className="mr-2" size={24} />
                My Notes ({filteredNotes.length})
              </h2>
              
              {/* Search Notes */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-border-color rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {filteredNotes.length > 0 ? (
              <div className="space-y-4">
                {filteredNotes.map((note) => (
                  <div key={note.id} className="border border-border-color rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start space-x-4">
                      <img
                        src={note.video.thumbnailUrl}
                        alt={note.video.title}
                        className="w-20 h-12 object-cover rounded-md flex-shrink-0"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-primary hover:underline cursor-pointer">
                              {note.video.title}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <span>{note.video.author}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Clock size={12} />
                                <span>{formatDuration(note.timestamp)}</span>
                              </div>
                              <span>•</span>
                              <span>{formatDate(note.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-3 leading-relaxed">
                          {note.content}
                        </p>
                        
                        {note.tags.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Tag size={14} className="text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                              {note.tags.map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button className="text-primary hover:text-primary-dark text-sm">
                          Edit
                        </button>
                        <button className="text-red-500 hover:text-red-700 text-sm">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchQuery ? 'No notes found matching your search' : 'No notes yet'}
                </p>
                {!searchQuery && (
                  <p className="text-sm text-gray-400 mt-2">
                    Start taking notes while watching videos to see them here
                  </p>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;