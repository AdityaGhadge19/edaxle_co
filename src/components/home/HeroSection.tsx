import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg overflow-hidden mb-10">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10"></div>
      
      <div className="relative z-20 px-6 py-16 md:py-24 md:px-10 max-w-screen-xl mx-auto">
        <div className="md:w-2/3">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Discover a New Way to Learn
          </h1>
          
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Access thousands of educational videos from expert teachers worldwide. 
            Track your progress, take notes, and earn certifications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {isAuthenticated ? (
              <Link
                to="/category/education"
                className="bg-white text-primary font-medium py-3 px-6 rounded-full inline-block text-center transition hover:bg-gray-100"
              >
                Explore Courses
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-primary font-medium py-3 px-6 rounded-full inline-block text-center transition hover:bg-gray-100"
                >
                  Get Started
                </Link>
                
                <Link
                  to="/login"
                  className="border border-white text-white font-medium py-3 px-6 rounded-full inline-block text-center transition hover:bg-white/10"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-light opacity-20 rounded-full transform translate-x-1/3 translate-y-1/4"></div>
      <div className="absolute top-0 right-10 w-64 h-64 bg-primary-light opacity-20 rounded-full transform -translate-y-1/3"></div>
    </div>
  );
};

export default HeroSection;