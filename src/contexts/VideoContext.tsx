import { createContext, useContext, useState, ReactNode } from 'react';
import { mockVideos, mockCategories } from '../data/mockData';

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
  getVideoById: (id: string) => Video | undefined;
  getVideosByCategory: (categoryId: string) => Video[];
  searchVideos: (query: string) => Video[];
};

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos] = useState<Video[]>(mockVideos);
  const [categories] = useState<Category[]>(mockCategories);
  
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
        categories,
        featuredVideos,
        trendingVideos,
        recentVideos,
        getVideoById,
        getVideosByCategory,
        searchVideos,
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