import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calculator, Atom, FlaskConical, Dna, Code, Clock, BookOpen, Globe, MapPin } from 'lucide-react';
import { Category } from '../../contexts/VideoContext';

type CategorySectionProps = {
  categories: Category[];
};

const CategorySection = ({ categories }: CategorySectionProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    
    const scrollAmount = 200; // Adjust for smaller circular cards
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    let newPosition;
    if (direction === 'left') {
      newPosition = Math.max(0, scrollPosition - scrollAmount);
    } else {
      newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
    }
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
    
    setScrollPosition(newPosition);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const iconProps = { size: 32, className: "text-white" };
    switch (categoryId) {
      case 'mathematics':
        return <Calculator {...iconProps} />;
      case 'physics':
        return <Atom {...iconProps} />;
      case 'chemistry':
        return <FlaskConical {...iconProps} />;
      case 'biology':
        return <Dna {...iconProps} />;
      case 'computer_science':
        return <Code {...iconProps} />;
      case 'history':
        return <Clock {...iconProps} />;
      case 'literature':
        return <BookOpen {...iconProps} />;
      case 'languages':
        return <Globe {...iconProps} />;
      case 'geography':
        return <MapPin {...iconProps} />;
      default:
        return <BookOpen {...iconProps} />;
    }
  };

  const getCategoryGradient = (categoryId: string) => {
    switch (categoryId) {
      case 'mathematics':
        return 'from-blue-500 to-blue-600';
      case 'physics':
        return 'from-purple-500 to-purple-600';
      case 'chemistry':
        return 'from-green-500 to-green-600';
      case 'biology':
        return 'from-emerald-500 to-emerald-600';
      case 'computer_science':
        return 'from-orange-500 to-orange-600';
      case 'history':
        return 'from-amber-500 to-amber-600';
      case 'literature':
        return 'from-pink-500 to-pink-600';
      case 'languages':
        return 'from-indigo-500 to-indigo-600';
      case 'geography':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Browse Categories</h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            disabled={scrollPosition <= 0}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex space-x-6 overflow-x-auto pb-4 custom-scrollbar scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="flex-shrink-0 flex flex-col items-center group"
          >
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getCategoryGradient(category.id)} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
              {getCategoryIcon(category.id)}
            </div>
            <h3 className="font-medium text-sm mt-3 text-center max-w-[80px] leading-tight">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;