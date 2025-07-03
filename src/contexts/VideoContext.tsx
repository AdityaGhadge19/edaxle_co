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

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transform Supabase data to our Video type
  const transformVideo = (dbVideo: any): Video => ({
    id: dbVideo.id,
    title: dbVideo.title,
    description: dbVideo.description,
    thumbnailUrl: dbVideo.thumbnail_url,
    videoUrl: dbVideo.video_url,
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
  });

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await videoApi.getAll();
      const transformedVideos = data?.map(transformVideo) || [];
      setVideos(transformedVideos);
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
      const newVideo = await videoApi.create({
        title: videoData.title,
        description: videoData.description,
        thumbnail_url: videoData.thumbnailUrl,
        video_url: videoData.videoUrl,
        duration: videoData.duration,
        author_id: videoData.authorId,
        category: videoData.category,
        tags: videoData.tags || [],
      });

      // Refresh videos to include the new one
      await loadVideos();
    } catch (err) {
      console.error('Error creating video:', err);
      throw err;
    }
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