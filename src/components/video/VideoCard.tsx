import { Link } from 'react-router-dom';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { formatViewCount, formatDuration } from '../../utils/formatUtils';

type VideoCardProps = {
  id: string;
  title: string;
  thumbnailUrl: string;
  authorName: string;
  authorAvatar: string;
  views: number;
  createdAt: string;
  duration: number;
  tags?: string[];
  likes?: number;
  isLiked?: boolean;
  onLike?: () => void;
};

const VideoCard = ({
  id,
  title,
  thumbnailUrl,
  authorName,
  authorAvatar,
  views,
  createdAt,
  duration,
  tags = [],
  likes = 0,
  isLiked = false,
  onLike
}: VideoCardProps) => {
  return (
    <div className="video-card bg-card-bg rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
      <Link to={`/video/${id}`} className="block relative">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(duration)}
        </div>
        
        {/* Tags overlay */}
        {tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded-full">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </Link>
      
      <div className="p-3">
        <div className="flex space-x-3">
          <Link to={`/teacher/${authorName.replace(/\s+/g, '-').toLowerCase()}`} className="flex-shrink-0">
            <img 
              src={authorAvatar} 
              alt={authorName} 
              className="w-9 h-9 rounded-full object-cover"
            />
          </Link>
          
          <div className="flex-1 min-w-0">
            <Link to={`/video/${id}`} className="block">
              <h3 className="text-sm font-medium line-clamp-2 hover:text-primary transition text-text-primary">{title}</h3>
            </Link>
            
            <Link to={`/teacher/${authorName.replace(/\s+/g, '-').toLowerCase()}`} className="mt-1 block">
              <p className="text-xs text-gray-600 dark:text-gray-400">{authorName}</p>
            </Link>
            
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {formatViewCount(views)} views • {formatDistanceToNow(createdAt)}
              </p>
              
              {onLike && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onLike();
                  }}
                  className={`flex items-center space-x-1 text-xs ${
                    isLiked ? 'text-red-500' : 'text-gray-500'
                  } hover:text-red-500 transition`}
                >
                  <svg className="w-3 h-3" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{formatViewCount(likes)}</span>
                </button>
              )}
            </div>
            
            {/* Tags below video info */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;