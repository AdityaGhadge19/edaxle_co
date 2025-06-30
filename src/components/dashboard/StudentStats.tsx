import { BookOpen, Award, Clock, Star } from 'lucide-react';

const StudentStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-card-bg rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <BookOpen className="text-primary h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Courses Enrolled</p>
            <h3 className="text-2xl font-bold">8</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
            <p className="text-xs text-green-500 font-medium">+2 new</p>
          </div>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
            <Clock className="text-green-600 dark:text-green-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Learning Hours</p>
            <h3 className="text-2xl font-bold">42.5</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">This month</p>
            <p className="text-xs text-green-500 font-medium">+8.2 hours</p>
          </div>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
            <Award className="text-purple-600 dark:text-purple-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Certifications</p>
            <h3 className="text-2xl font-bold">3</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">Next milestone</p>
            <p className="text-xs text-blue-500 font-medium">1 in progress</p>
          </div>
        </div>
      </div>

      <div className="bg-card-bg rounded-lg shadow-md p-6 transition-transform hover:translate-y-[-4px]">
        <div className="flex items-center space-x-4">
          <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
            <Star className="text-orange-600 dark:text-orange-400 h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
            <h3 className="text-2xl font-bold">4.8/5</h3>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">From 24 ratings</p>
            <p className="text-xs text-green-500 font-medium">+0.2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentStats;