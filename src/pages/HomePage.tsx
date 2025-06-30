import { useVideos } from '../contexts/VideoContext';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedVideos from '../components/home/FeaturedVideos';

const HomePage = () => {
  const { featuredVideos, trendingVideos, recentVideos, categories } = useVideos();

  return (
    <div>
      <HeroSection />
      
      <CategorySection categories={categories} />
      
      <FeaturedVideos videos={featuredVideos} title="Featured Content" />
      
      <FeaturedVideos videos={trendingVideos} title="Trending Now" />
      
      <FeaturedVideos videos={recentVideos} title="Recently Uploaded" />
    </div>
  );
};

export default HomePage;