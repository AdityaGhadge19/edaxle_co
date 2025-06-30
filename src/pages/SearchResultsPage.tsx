import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';
import VideoCard from '../components/video/VideoCard';

const SearchResultsPage = () => {
  const location = useLocation();
  const { searchVideos } = useVideos();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof searchVideos>>([]);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q') || '';
    setQuery(q);
    setResults(searchVideos(q));
  }, [location.search, searchVideos]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Search Results for "{query}"
      </h1>
      
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((video) => (
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
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No results found for "{query}"</p>
          <p className="text-sm">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;