import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { videoApi } from '../lib/api/videos';
import { profileApi } from '../lib/api/profiles';

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  category: string;
  tags: string[];
  likes?: number;
  commentCount?: number;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
};

type VideoContextType = {
  videos: Video[];
  categories: Category[];
  featuredVideos: Video[];
  trendingVideos: Video[];
  recentVideos: Video[];
  loading: boolean;
  error: string | null;
  getVideoById: (id: string) => Video | undefined;
  getVideosByCategory: (categoryId: string) => Video[];
  searchVideos: (query: string) => Video[];
  refreshVideos: () => Promise<void>;
  createVideo: (videoData: any) => Promise<void>;
  incrementVideoViews: (videoId: string, userId?: string) => Promise<void>;
  viewedVideos: Set<string>;
  updateVideoStats: (videoId: string, updates: { views?: number; likes?: number; commentCount?: number }) => void;
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

// Mock categories - in a real app, these might come from the database too
const mockCategories: Category[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Learn mathematics from basic arithmetic to advanced calculus',
    imageUrl: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'physics',
    name: 'Physics',
    slug: 'physics',
    description: 'Explore the fundamental laws that govern our universe',
    imageUrl: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    slug: 'chemistry',
    description: 'Study matter, its properties, and chemical reactions',
    imageUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'biology',
    name: 'Biology',
    slug: 'biology',
    description: 'Discover the science of life and living organisms',
    imageUrl: 'https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'computer_science',
    name: 'Computer Science',
    slug: 'computer-science',
    description: 'Learn programming, algorithms, and computer systems',
    imageUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'history',
    name: 'History',
    slug: 'history',
    description: 'Explore world history and important historical events',
    imageUrl: 'https://images.pexels.com/photos/159275/macro-focus-cogwheel-gear-159275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'literature',
    name: 'Literature',
    slug: 'literature',
    description: 'Study classic and contemporary literary works',
    imageUrl: 'https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'languages',
    name: 'Languages',
    slug: 'languages',
    description: 'Learn new languages and improve your communication skills',
    imageUrl: 'https://images.pexels.com/photos/5676744/pexels-photo-5676744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'geography',
    name: 'Geography',
    slug: 'geography',
    description: 'Study the Earth, its features, and human geography',
    imageUrl: 'https://images.pexels.com/photos/269724/pexels-photo-269724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

// Sample working video URLs for testing
const sampleVideoUrls = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
];

// Function to check if a video URL is a placeholder or non-functional
const isPlaceholderUrl = (url: string): boolean => {
  if (!url) return true;
  
  const placeholderDomains = [
    'example.com',
    'sample-videos.com',
    'placeholder.com',
    'test.com',
    'demo.com',
    'localhost',
    '127.0.0.1'
  ];
  
  return placeholderDomains.some(domain => url.includes(domain));
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewedVideos, setViewedVideos] = useState<Set<string>>(new Set());

  // Load viewed videos from localStorage on mount
  useEffect(() => {
    const savedViewedVideos = localStorage.getItem('viewedVideos');
    if (savedViewedVideos) {
      try {
        const parsed = JSON.parse(savedViewedVideos);
        setViewedVideos(new Set(parsed));
      } catch (error) {
        console.error('Error parsing viewed videos from localStorage:', error);
      }
    }
  }, []);

  // Save viewed videos to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('viewedVideos', JSON.stringify(Array.from(viewedVideos)));
  }, [viewedVideos]);

  // Transform Supabase data to our Video type
  const transformVideo = (dbVideo: any, index: number = 0): Video => {
    // Check if the video URL from database is a placeholder or non-functional
    let videoUrl = dbVideo.video_url;
    
    if (!videoUrl || isPlaceholderUrl(videoUrl)) {
      // Use a working sample video URL instead
      videoUrl = sampleVideoUrls[index % sampleVideoUrls.length];
    }

    return {
      id: dbVideo.id,
      title: dbVideo.title,
      description: dbVideo.description,
      thumbnailUrl: dbVideo.thumbnail_url,
      videoUrl: videoUrl,
      duration: dbVideo.duration,
      views: dbVideo.views,
      createdAt: dbVideo.created_at,
      author: {
        id: dbVideo.profiles?.id || dbVideo.author_id,
        name: dbVideo.profiles?.name || 'Unknown',
        avatar: dbVideo.profiles?.avatar_url || 'https://randomuser.me/api/portraits/men/1.jpg',
        isVerified: dbVideo.profiles?.is_verified || false,
      },
      category: dbVideo.category,
      tags: dbVideo.tags || [],
      likes: Math.floor(Math.random() * 1000) + 100, // Mock likes
      commentCount: Math.floor(Math.random() * 50) + 5, // Mock comment count
    };
  };

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videoApi.getAll();
      const transformedVideos = data?.map((video, index) => transformVideo(video, index)) || [];
      
      // If no videos from database, create some sample videos for testing
      if (transformedVideos.length === 0) {
        const sampleVideos: Video[] = [
          {
            id: 'sample-1',
            title: 'Introduction to Calculus',
            description: 'Learn the fundamental concepts of calculus including limits, derivatives, and integrals.',
            thumbnailUrl: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            videoUrl: sampleVideoUrls[0],
            duration: 596,
            views: 2000,
            createdAt: new Date().toISOString(),
            author: {
              id: 'sample-author-1',
              name: 'Math Masters',
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              isVerified: true,
            },
            category: 'mathematics',
            tags: ['calculus', 'mathematics', 'derivatives', 'integrals'],
            likes: 150,
            commentCount: 25,
          },
          {
            id: 'sample-2',
            title: 'Physics: Laws of Motion',
            description: 'Understanding Newton\'s laws of motion and their applications.',
            thumbnailUrl: 'https://images.pexels.com/photos/2085832/pexels-photo-2085832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            videoUrl: sampleVideoUrls[1],
            duration: 734,
            views: 5000,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            author: {
              id: 'sample-author-2',
              name: 'Physics Academy',
              avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
              isVerified: true,
            },
            category: 'physics',
            tags: ['physics', 'mechanics', 'newton laws'],
            likes: 320,
            commentCount: 45,
          },
          {
            id: 'sample-3',
            title: 'Chemical Bonding Explained',
            description: 'Understanding different types of chemical bonds and their properties.',
            thumbnailUrl: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            videoUrl: sampleVideoUrls[2],
            duration: 420,
            views: 2700,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            author: {
              id: 'sample-author-3',
              name: 'Chemistry Lab',
              avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
              isVerified: true,
            },
            category: 'chemistry',
            tags: ['chemistry', 'chemical bonds', 'science'],
            likes: 180,
            commentCount: 30,
          },
          {
            id: 'sample-4',
            title: 'Introduction to Python Programming',
            description: 'Learn the basics of Python programming language for beginners.',
            thumbnailUrl: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            videoUrl: sampleVideoUrls[3],
            duration: 1200,
            views: 506000,
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            author: {
              id: 'sample-author-4',
              name: 'Code Masters',
              avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
              isVerified: true,
            },
            category: 'computer_science',
            tags: ['programming', 'python', 'coding'],
            likes: 2500,
            commentCount: 180,
          },
        ];
        setVideos(sampleVideos);
      } else {
        setVideos(transformedVideos);
      }
    } catch (err) {
      console.error('Error loading videos:', err);
      setError('Failed to load videos');
      // Fallback to empty array if there's an error
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const createVideo = async (videoData: any) => {
    try {
      // Use a working video URL for testing
      const videoUrlToUse = videoData.videoUrl || sampleVideoUrls[Math.floor(Math.random() * sampleVideoUrls.length)];
      
      const newVideo = await videoApi.create({
        title: videoData.title,
        description: videoData.description,
        thumbnail_url: videoData.thumbnailUrl,
        video_url: videoUrlToUse,
        duration: videoData.duration,
        author_id: videoData.authorId,
        category: videoData.category,
        tags: videoData.tags || [],
      });

      // Create a properly formatted video object for immediate display
      const formattedNewVideo: Video = {
        id: newVideo.id,
        title: newVideo.title,
        description: newVideo.description,
        thumbnailUrl: newVideo.thumbnail_url,
        videoUrl: videoUrlToUse,
        duration: newVideo.duration,
        views: 0,
        createdAt: newVideo.created_at,
        author: {
          id: newVideo.author_id,
          name: videoData.authorName || 'Current User',
          avatar: videoData.authorAvatar || 'https://randomuser.me/api/portraits/men/1.jpg',
          isVerified: false,
        },
        category: newVideo.category,
        tags: newVideo.tags || [],
        likes: 0,
        commentCount: 0,
      };

      // Add the new video to the beginning of the list for immediate display
      setVideos(prevVideos => [formattedNewVideo, ...prevVideos]);

    } catch (err) {
      console.error('Error creating video:', err);
      throw err;
    }
  };

  const incrementVideoViews = async (videoId: string, userId?: string) => {
    // Check if this video has already been viewed by this user/session
    if (viewedVideos.has(videoId)) {
      return; // Don't increment view if already viewed
    }

    try {
      // Add to viewed videos set
      setViewedVideos(prev => new Set([...prev, videoId]));

      // Call the API to increment views in the database
      await videoApi.incrementViews(videoId, userId);
    } catch (error) {
      console.error('Error incrementing video views:', error);
      // Revert the local state change if API call fails
      setViewedVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
    }
  };

  const updateVideoStats = (videoId: string, updates: { views?: number; likes?: number; commentCount?: number }) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              ...(updates.views !== undefined && { views: updates.views }),
              ...(updates.likes !== undefined && { likes: updates.likes }),
              ...(updates.commentCount !== undefined && { commentCount: updates.commentCount })
            }
          : video
      )
    );
  };

  // Filter for featured videos (could be based on various criteria)
  const featuredVideos = videos
    .filter(video => video.views > 1000)
    .slice(0, 4);
  
  // Filter for trending videos
  const trendingVideos = [...videos]
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);
  
  // Filter for recent videos
  const recentVideos = [...videos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  
  const getVideoById = (id: string) => {
    return videos.find(video => video.id === id);
  };
  
  const getVideosByCategory = (categoryId: string) => {
    return videos.filter(video => video.category === categoryId);
  };
  
  const searchVideos = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return videos.filter(
      video => 
        video.title.toLowerCase().includes(lowercaseQuery) || 
        video.description.toLowerCase().includes(lowercaseQuery) ||
        video.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        categories: mockCategories,
        featuredVideos,
        trendingVideos,
        recentVideos,
        loading,
        error,
        getVideoById,
        getVideosByCategory,
        searchVideos,
        refreshVideos: loadVideos,
        createVideo,
        incrementVideoViews,
        viewedVideos,
        updateVideoStats,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideos = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
};