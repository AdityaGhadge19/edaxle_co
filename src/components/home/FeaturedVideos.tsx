import { Video } from '../../contexts/VideoContext';
import VideoCard from '../video/VideoCard';

type FeaturedVideosProps = {
  videos: Video[];
  title: string;
};

const FeaturedVideos = ({ videos, title }: FeaturedVideosProps) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
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
            likes={Math.floor(Math.random() * 1000) + 100}
            commentCount={Math.floor(Math.random() * 50) + 5}
            showStats={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedVideos;